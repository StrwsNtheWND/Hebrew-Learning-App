import { db, todayKey } from './db'
import { allVocab, vocabById, lessonUnits, milestoneDefs } from '../content'
import type { VocabItem, Domain } from '../types/content'
import type {
  ItemProgress,
  ExerciseType,
  AttemptRecord,
  LessonResult,
  PersonalDeckItem,
  MilestoneRecord,
} from '../types/progress'
import { createInitialProgress, applyReview, scoreToQuality, isDue, masteryLabel } from './srs'
import { createInitialDomainSkill, updateDomainSkill } from './adaptiveDifficulty'
import { percentageToLetterGrade } from './grading'

const NEW_ITEMS_PER_SESSION = 8

function uid(): string {
  return crypto.randomUUID()
}

// ---------- Vocab lookup (built-in + personal deck) ----------

export async function getPersonalVocab(): Promise<VocabItem[]> {
  const items = await db.personalDeck.toArray()
  return items.map(
    (p): VocabItem => ({
      id: p.id,
      domain: 'personal',
      register: 'casual',
      kind: 'phrase',
      hebrew: p.hebrew,
      transliteration: p.transliteration,
      english: p.english,
      notes: p.notes,
      difficulty: 2,
    }),
  )
}

export async function getAllVocabIncludingPersonal(): Promise<VocabItem[]> {
  const personal = await getPersonalVocab()
  return [...allVocab, ...personal]
}

export async function addPersonalItem(input: {
  hebrew: string
  transliteration: string
  english: string
  notes?: string
  domain: Domain
}): Promise<PersonalDeckItem> {
  const item: PersonalDeckItem = { id: uid(), createdAt: Date.now(), ...input }
  await db.personalDeck.add(item)
  return item
}

export async function deletePersonalItem(id: string): Promise<void> {
  await db.personalDeck.delete(id)
  await db.itemProgress.delete(id)
}

export async function listPersonalItems(): Promise<PersonalDeckItem[]> {
  return db.personalDeck.orderBy('createdAt').reverse().toArray()
}

// ---------- Progress / SRS ----------

export async function getProgress(itemId: string): Promise<ItemProgress> {
  const existing = await db.itemProgress.get(itemId)
  return existing ?? createInitialProgress(itemId)
}

export async function getAllProgress(): Promise<ItemProgress[]> {
  return db.itemProgress.toArray()
}

/** Items due for review right now, including never-studied items up to a daily cap. */
export async function getReviewQueue(opts: { domain?: Domain; limit?: number } = {}): Promise<
  { item: VocabItem; progress: ItemProgress }[]
> {
  const vocab = await getAllVocabIncludingPersonal()
  const pool = opts.domain ? vocab.filter((v) => v.domain === opts.domain) : vocab
  const progressList = await db.itemProgress.toArray()
  const progressById = new Map(progressList.map((p) => [p.itemId, p]))

  const due: { item: VocabItem; progress: ItemProgress }[] = []
  const fresh: { item: VocabItem; progress: ItemProgress }[] = []

  for (const item of pool) {
    const progress = progressById.get(item.id)
    if (progress) {
      if (isDue(progress)) due.push({ item, progress })
    } else {
      fresh.push({ item, progress: createInitialProgress(item.id) })
    }
  }

  due.sort((a, b) => a.progress.dueAt - b.progress.dueAt)
  const limit = opts.limit ?? 20
  const newBudget = Math.min(NEW_ITEMS_PER_SESSION, Math.max(0, limit - due.length))

  return [...due, ...fresh.slice(0, newBudget)].slice(0, limit)
}

export interface RecordAttemptInput {
  itemId: string
  domain: Domain
  exerciseType: ExerciseType
  correct: boolean
  score: number // 0-1
}

export async function recordAttempt(input: RecordAttemptInput): Promise<ItemProgress> {
  const progress = await getProgress(input.itemId)
  const quality = scoreToQuality(input.correct, input.score)
  const updated = applyReview(progress, quality)
  await db.itemProgress.put(updated)

  const attempt: AttemptRecord = {
    id: uid(),
    itemId: input.itemId,
    exerciseType: input.exerciseType,
    correct: input.correct,
    score: input.score,
    answeredAt: Date.now(),
    domain: input.domain,
  }
  await db.attempts.add(attempt)

  await bumpDailyStat({ reviewed: 1, correct: input.correct ? 1 : 0, isNew: progress.repetitions === 0 && progress.lastReviewedAt === null })
  await bumpDomainSkill(input.domain, input.correct, input.score)

  return updated
}

/**
 * Scenario completions are logged as attempts (for stats/milestones/adaptive
 * difficulty) but deliberately do NOT touch itemProgress/SRS — a scenario
 * isn't a single vocab item, so it shouldn't count toward "words mastered".
 */
export async function recordScenarioCompletion(input: {
  scenarioId: string
  domain: Domain
  correct: boolean
  score: number
}): Promise<void> {
  const attempt: AttemptRecord = {
    id: uid(),
    itemId: input.scenarioId,
    exerciseType: 'scenario',
    correct: input.correct,
    score: input.score,
    answeredAt: Date.now(),
    domain: input.domain,
  }
  await db.attempts.add(attempt)
  await bumpDailyStat({ reviewed: 1, correct: input.correct ? 1 : 0, isNew: false })
  await bumpDomainSkill(input.domain, input.correct, input.score)
}

async function bumpDailyStat(delta: { reviewed: number; correct: number; isNew: boolean }): Promise<void> {
  const key = todayKey()
  const existing = await db.dailyStats.get(key)
  const base = existing ?? { date: key, itemsReviewed: 0, correctCount: 0, minutesActive: 0, newWordsLearned: 0 }
  await db.dailyStats.put({
    ...base,
    itemsReviewed: base.itemsReviewed + delta.reviewed,
    correctCount: base.correctCount + delta.correct,
    newWordsLearned: base.newWordsLearned + (delta.isNew ? 1 : 0),
  })
}

export async function logActiveMinutes(minutes: number): Promise<void> {
  const key = todayKey()
  const existing = await db.dailyStats.get(key)
  const base = existing ?? { date: key, itemsReviewed: 0, correctCount: 0, minutesActive: 0, newWordsLearned: 0 }
  await db.dailyStats.put({ ...base, minutesActive: base.minutesActive + minutes })
}

async function bumpDomainSkill(domain: Domain, correct: boolean, score: number): Promise<void> {
  const existing = await db.domainSkills.get(domain)
  const skill = existing ?? createInitialDomainSkill(domain)
  await db.domainSkills.put(updateDomainSkill(skill, correct, score))
}

export async function getDomainSkills() {
  return db.domainSkills.toArray()
}

// ---------- Lessons ----------

export async function recordLessonResult(input: {
  lessonId: string
  domain: Domain
  startedAt: number
  totalItems: number
  correctItems: number
}): Promise<LessonResult> {
  const percentage = input.totalItems === 0 ? 0 : Math.round((input.correctItems / input.totalItems) * 100)
  const result: LessonResult = {
    id: uid(),
    lessonId: input.lessonId,
    domain: input.domain,
    startedAt: input.startedAt,
    finishedAt: Date.now(),
    totalItems: input.totalItems,
    correctItems: input.correctItems,
    percentage,
    letterGrade: percentageToLetterGrade(percentage),
  }
  await db.lessonResults.add(result)
  return result
}

export async function getLessonResults(): Promise<LessonResult[]> {
  return db.lessonResults.orderBy('finishedAt').reverse().toArray()
}

export async function getScenarioCompletionCount(): Promise<number> {
  // One attempt record is logged per completed scenario run (see ScenarioPlayer).
  return db.attempts.where('exerciseType').equals('scenario').count()
}

// ---------- Stats & streaks ----------

export async function getStreakInfo(): Promise<{ currentStreak: number; longestStreak: number }> {
  const stats = await db.dailyStats.toArray()
  const activeDates = new Set(stats.filter((s) => s.itemsReviewed > 0).map((s) => s.date))
  if (activeDates.size === 0) return { currentStreak: 0, longestStreak: 0 }

  const sorted = [...activeDates].sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000)
    run = diffDays === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
  }

  // Current streak counts back from today; if today has no activity yet,
  // start from yesterday so an in-progress streak isn't shown as broken.
  const cursor = new Date()
  if (!activeDates.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let currentStreak = 0
  while (activeDates.has(todayKey(cursor))) {
    currentStreak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return { currentStreak, longestStreak: longest }
}

export interface DashboardStats {
  wordsMastered: number
  wordsInProgress: number
  totalWordsAvailable: number
  lessonsCompleted: number
  scenariosCompleted: number
  currentStreak: number
  longestStreak: number
  domainsAtStrong: number
  todayItemsReviewed: number
  dailyGoalMinutesToday: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [progressList, lessonResults, scenarioCount, streak, domainSkills, vocab, todayStat] = await Promise.all([
    getAllProgress(),
    getLessonResults(),
    getScenarioCompletionCount(),
    getStreakInfo(),
    getDomainSkills(),
    getAllVocabIncludingPersonal(),
    db.dailyStats.get(todayKey()),
  ])

  const wordsMastered = progressList.filter((p) => p.mastery >= 65).length
  const wordsInProgress = progressList.filter((p) => p.mastery > 0 && p.mastery < 65).length
  const completedLessonIds = new Set(lessonResults.filter((r) => r.percentage >= 70).map((r) => r.lessonId))
  const domainsAtStrong = domainSkills.filter((d) => d.rollingAccuracy >= 0.8).length

  return {
    wordsMastered,
    wordsInProgress,
    totalWordsAvailable: vocab.length,
    lessonsCompleted: completedLessonIds.size,
    scenariosCompleted: scenarioCount,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    domainsAtStrong,
    todayItemsReviewed: todayStat?.itemsReviewed ?? 0,
    dailyGoalMinutesToday: todayStat?.minutesActive ?? 0,
  }
}

export async function getHistoricalDailyStats(days = 30) {
  const all = await db.dailyStats.toArray()
  return all.sort((a, b) => a.date.localeCompare(b.date)).slice(-days)
}

// ---------- Milestones ----------

export async function checkAndRecordMilestones(): Promise<MilestoneRecord[]> {
  const stats = await getDashboardStats()
  const existing = await db.milestones.toArray()
  const existingIds = new Set(existing.map((m) => m.milestoneId))

  const newlyAchieved: MilestoneRecord[] = []
  for (const def of milestoneDefs) {
    if (existingIds.has(def.id)) continue
    if (
      def.check({
        wordsMastered: stats.wordsMastered,
        lessonsCompleted: stats.lessonsCompleted,
        scenariosCompleted: stats.scenariosCompleted,
        longestStreakDays: stats.longestStreak,
        domainsAtStrong: stats.domainsAtStrong,
      })
    ) {
      const record: MilestoneRecord = { id: uid(), milestoneId: def.id, achievedAt: Date.now(), label: def.label, detail: def.detail }
      await db.milestones.add(record)
      newlyAchieved.push(record)
    }
  }
  return newlyAchieved
}

export async function getMilestoneHistory(): Promise<MilestoneRecord[]> {
  return db.milestones.orderBy('achievedAt').reverse().toArray()
}

// ---------- Lesson unit progress helpers ----------

export async function getLessonUnitProgress(lessonId: string) {
  const unit = lessonUnits.find((l) => l.id === lessonId)
  if (!unit) return null
  const progressList = await Promise.all(unit.itemIds.map((id) => getProgress(id)))
  const avgMastery = progressList.reduce((sum, p) => sum + p.mastery, 0) / progressList.length
  return { unit, avgMastery, items: unit.itemIds.map((id, i) => ({ item: vocabById[id], progress: progressList[i] })) }
}

export { masteryLabel }
