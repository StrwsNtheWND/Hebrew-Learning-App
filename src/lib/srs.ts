import type { ItemProgress } from '../types/progress'

/**
 * SM-2-lite spaced repetition scheduler.
 * Quality is 0-5 (like classic SuperMemo): 0-2 = fail/lapse, 3-5 = pass with
 * increasing confidence. We derive quality from correctness + partial score
 * so multiple-choice, typed, and speech exercises all feed the same engine.
 */

const MIN_EASE = 1.3
const DAY_MS = 24 * 60 * 60 * 1000

export function scoreToQuality(correct: boolean, score: number): number {
  if (!correct) return score > 0.4 ? 2 : 0
  if (score >= 0.95) return 5
  if (score >= 0.8) return 4
  return 3
}

export function createInitialProgress(itemId: string): ItemProgress {
  const now = Date.now()
  return {
    itemId,
    mastery: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now,
    lastReviewedAt: null,
    lapses: 0,
    createdAt: now,
  }
}

export function applyReview(progress: ItemProgress, quality: number): ItemProgress {
  const now = Date.now()
  const q = Math.max(0, Math.min(5, quality))

  let { easeFactor, intervalDays, repetitions, lapses } = progress

  if (q < 3) {
    repetitions = 0
    intervalDays = 1
    lapses += 1
  } else {
    if (repetitions === 0) intervalDays = 1
    else if (repetitions === 1) intervalDays = 4
    else intervalDays = Math.round(intervalDays * easeFactor)
    repetitions += 1
  }

  easeFactor = Math.max(
    MIN_EASE,
    easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  )

  const mastery = computeMastery({ ...progress, repetitions, intervalDays, lapses, easeFactor })

  return {
    ...progress,
    easeFactor,
    intervalDays,
    repetitions,
    lapses,
    mastery,
    dueAt: now + intervalDays * DAY_MS,
    lastReviewedAt: now,
  }
}

/** Mastery is a 0-100 display metric derived from repetitions/interval/lapses. */
function computeMastery(p: {
  repetitions: number
  intervalDays: number
  lapses: number
  easeFactor: number
}): number {
  const repScore = Math.min(1, p.repetitions / 6) // caps out around 6 successful reps
  const intervalScore = Math.min(1, p.intervalDays / 60) // caps out at ~2 months interval
  const lapsePenalty = Math.min(0.4, p.lapses * 0.08)
  const raw = repScore * 0.5 + intervalScore * 0.5 - lapsePenalty
  return Math.round(Math.max(0, Math.min(1, raw)) * 100)
}

export function isDue(progress: ItemProgress, at: number = Date.now()): boolean {
  return progress.dueAt <= at
}

export function masteryLabel(mastery: number): string {
  if (mastery >= 90) return 'Mastered'
  if (mastery >= 65) return 'Strong'
  if (mastery >= 35) return 'Learning'
  if (mastery > 0) return 'New'
  return 'Not started'
}
