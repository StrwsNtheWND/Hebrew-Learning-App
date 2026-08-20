import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { ProgressBar } from '../../components/ProgressBar'
import { Exercise, pickExerciseType, type ExerciseResult } from '../lesson/Exercise'
import { TeachCard } from '../lesson/TeachCard'
import { getReviewQueue, getAllVocabIncludingPersonal, recordAttempt, checkAndRecordMilestones } from '../../lib/storage'
import { buildLessonPlan, countQuizSteps, type LessonStep } from '../../lib/lessonPlan'
import { useSettings } from '../../state/SettingsContext'
import type { VocabItem } from '../../types/content'
import type { ItemProgress, MilestoneRecord } from '../../types/progress'

export function ReviewSession() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [queue, setQueue] = useState<{ item: VocabItem; progress: ItemProgress }[] | null>(null)
  const [pool, setPool] = useState<VocabItem[]>([])
  const [plan, setPlan] = useState<LessonStep[] | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [newMilestones, setNewMilestones] = useState<MilestoneRecord[]>([])

  useEffect(() => {
    Promise.all([getReviewQueue({ limit: 20 }), getAllVocabIncludingPersonal()]).then(([q, p]) => {
      setQueue(q)
      setPool(p)
      // Never-reviewed items (no DB row — see getReviewQueue) get taught in
      // a batch first, then quizzed back in shuffled order; already-due
      // items go straight into their own shuffled quiz round.
      const isNewById = new Map(q.map((entry) => [entry.item.id, entry.progress.lastReviewedAt === null]))
      setPlan(buildLessonPlan(q.map((entry) => entry.item), (id) => isNewById.get(id) ?? false))
    })
  }, [])

  const step = plan?.[stepIndex]
  const totalQuizSteps = plan ? countQuizSteps(plan) : 0

  const exerciseType = useMemo(
    () => (step?.item ? pickExerciseType(step.item, settings.speechEnabled, step.isNew) : 'multiple-choice'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step?.item.id, step?.type, settings.speechEnabled, step?.isNew],
  )

  async function handleResult(result: ExerciseResult) {
    if (!step || !plan) return
    await recordAttempt({
      itemId: step.item.id,
      domain: step.item.domain,
      exerciseType: result.exerciseType,
      correct: result.correct,
      score: result.score,
    })
    if (result.correct) setCorrectCount((c) => c + 1)
    setQuizAnswered((n) => n + 1)

    if (stepIndex + 1 >= plan.length) {
      const milestones = await checkAndRecordMilestones()
      setNewMilestones(milestones)
      setFinished(true)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  if (queue === null || plan === null) {
    return (
      <div className="mx-auto max-w-md px-4 pt-4">
        <TopBar title="Review" onBack />
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title="Review" onBack />
        <Card className="mt-6 text-center">
          <p className="text-3xl">🎉</p>
          <p className="mt-2 text-slate-200">Nothing due right now — come back later.</p>
        </Card>
        <Button className="mt-4" fullWidth onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    )
  }

  if (finished) {
    const pct = totalQuizSteps === 0 ? 0 : Math.round((correctCount / totalQuizSteps) * 100)
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title="Review" onBack />
        <Card className="mt-6 text-center">
          <p className="text-sm text-slate-400">Session complete</p>
          <p className="mt-2 text-4xl font-bold text-amber-400">{pct}%</p>
          <p className="mt-1 text-slate-300">
            {correctCount} / {totalQuizSteps} correct
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
        <Button className="mt-6" fullWidth onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    )
  }

  if (!step) return null

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title="Review" onBack />
      <div className="mt-3 mb-4">
        {step.type === 'teach' ? (
          <p className="text-xs font-medium uppercase tracking-wide text-amber-500/80">Learning new words…</p>
        ) : (
          <>
            <ProgressBar value={(quizAnswered / totalQuizSteps) * 100} />
            <p className="mt-1 text-xs text-slate-500">
              Question {quizAnswered + 1} / {totalQuizSteps}
            </p>
          </>
        )}
      </div>
      {step.type === 'teach' ? (
        <TeachCard item={step.item} onContinue={() => setStepIndex((i) => i + 1)} />
      ) : (
        <Exercise key={`${step.item.id}-${stepIndex}`} item={step.item} distractorPool={pool} exerciseType={exerciseType} onResult={handleResult} />
      )}
    </div>
  )
}
