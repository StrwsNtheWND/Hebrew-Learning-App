import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { ProgressBar } from '../../components/ProgressBar'
import { Exercise, pickExerciseType, type ExerciseResult } from './Exercise'
import { TeachCard } from './TeachCard'
import { ConceptCard } from './ConceptCard'
import { lessonUnits, allVocab, vocabById } from '../../content'
import {
  getAllVocabIncludingPersonal,
  getProgress,
  recordAttempt,
  recordLessonResult,
  checkAndRecordMilestones,
} from '../../lib/storage'
import { percentageToLetterGrade } from '../../lib/grading'
import { useSettings } from '../../state/SettingsContext'
import type { VocabItem } from '../../types/content'
import type { MilestoneRecord } from '../../types/progress'

type Phase = 'concept' | 'teach' | 'quiz'

export function LessonRunner() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { settings } = useSettings()
  const unit = lessonUnits.find((u) => u.id === lessonId)

  const [pool, setPool] = useState<VocabItem[]>(allVocab)
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(Date.now())
  const [finished, setFinished] = useState(false)
  const [newMilestones, setNewMilestones] = useState<MilestoneRecord[]>([])
  // The concept explainer (if this lesson has one) must be dismissed before
  // any per-item phase logic runs — otherwise the item-newness effect below
  // fires on mount and immediately stomps the 'concept' phase.
  const [conceptDone, setConceptDone] = useState(!unit?.concept)
  const [phase, setPhase] = useState<Phase>(unit?.concept ? 'concept' : 'teach')
  const [itemIsNew, setItemIsNew] = useState(false)
  const [checkingProgress, setCheckingProgress] = useState(true)

  useEffect(() => {
    getAllVocabIncludingPersonal().then(setPool)
  }, [])

  const items = useMemo(() => (unit ? unit.itemIds.map((id) => vocabById[id]).filter(Boolean) : []), [unit])
  const currentItem = items[index]

  // Every item gets checked against its saved progress so we only show the
  // TeachCard (and restrict to recognition exercises) the first time it's
  // ever quizzed — once it's been reviewed, it goes straight to a normal quiz.
  useEffect(() => {
    if (!currentItem || !conceptDone) return
    setCheckingProgress(true)
    getProgress(currentItem.id).then((progress) => {
      const isNew = progress.lastReviewedAt === null
      setItemIsNew(isNew)
      setPhase(isNew ? 'teach' : 'quiz')
      setCheckingProgress(false)
    })
  }, [currentItem, conceptDone])

  const exerciseType = useMemo(
    () => (currentItem ? pickExerciseType(currentItem, settings.speechEnabled, itemIsNew) : 'multiple-choice'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem?.id, settings.speechEnabled, itemIsNew],
  )

  if (!unit) {
    return (
      <div className="mx-auto max-w-md px-4 pt-4">
        <TopBar title="Lesson not found" onBack />
      </div>
    )
  }

  async function handleResult(result: ExerciseResult) {
    if (!currentItem || !unit) return
    await recordAttempt({
      itemId: currentItem.id,
      domain: currentItem.domain,
      exerciseType: result.exerciseType,
      correct: result.correct,
      score: result.score,
    })
    if (result.correct) setCorrectCount((c) => c + 1)

    if (index + 1 >= items.length) {
      await recordLessonResult({
        lessonId: unit.id,
        domain: unit.domain,
        startedAt,
        totalItems: items.length,
        correctItems: correctCount + (result.correct ? 1 : 0),
      })
      const milestones = await checkAndRecordMilestones()
      setNewMilestones(milestones)
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (finished) {
    const pct = items.length === 0 ? 0 : Math.round((correctCount / items.length) * 100)
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title={unit.title} onBack />
        <Card className="mt-6 text-center">
          <p className="text-sm text-slate-400">Lesson complete</p>
          <p className="mt-2 text-5xl font-bold text-amber-400">{percentageToLetterGrade(pct)}</p>
          <p className="mt-1 text-slate-300">
            {correctCount} / {items.length} correct ({pct}%)
          </p>
        </Card>

        {newMilestones.length > 0 && (
          <div className="mt-4 space-y-2">
            {newMilestones.map((m) => (
              <Card key={m.id} className="border-amber-500/40 bg-amber-500/5">
                <p className="text-sm font-semibold text-amber-300">🏅 {m.label}</p>
                <p className="text-xs text-slate-400">{m.detail}</p>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Button fullWidth onClick={() => navigate('/')}>
            Back to home
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setIndex(0)
              setCorrectCount(0)
              setFinished(false)
              setNewMilestones([])
              setConceptDone(!unit.concept)
              setPhase(unit.concept ? 'concept' : 'teach')
            }}
          >
            Redo lesson
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'concept' && unit.concept) {
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title={unit.title} onBack />
        <div className="mt-3">
          <ConceptCard concept={unit.concept} onContinue={() => setConceptDone(true)} />
        </div>
      </div>
    )
  }

  if (!currentItem || checkingProgress) return null

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title={unit.title} onBack />
      <div className="mt-3 mb-4">
        <ProgressBar value={(index / items.length) * 100} />
        <p className="mt-1 text-xs text-slate-500">
          {index + 1} / {items.length}
        </p>
      </div>
      {phase === 'teach' ? (
        <TeachCard item={currentItem} onContinue={() => setPhase('quiz')} />
      ) : (
        <Exercise key={currentItem.id} item={currentItem} distractorPool={pool} exerciseType={exerciseType} onResult={handleResult} />
      )}
    </div>
  )
}
