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
import { buildLessonPlan, countQuizSteps, type LessonStep } from '../../lib/lessonPlan'
import { percentageToLetterGrade } from '../../lib/grading'
import { useSettings } from '../../state/SettingsContext'
import type { VocabItem } from '../../types/content'
import type { MilestoneRecord } from '../../types/progress'

export function LessonRunner() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { settings } = useSettings()
  const unit = lessonUnits.find((u) => u.id === lessonId)

  const [pool, setPool] = useState<VocabItem[]>(allVocab)
  const [conceptDone, setConceptDone] = useState(!unit?.concept)
  const [plan, setPlan] = useState<LessonStep[] | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(Date.now())
  const [finished, setFinished] = useState(false)
  const [newMilestones, setNewMilestones] = useState<MilestoneRecord[]>([])

  useEffect(() => {
    getAllVocabIncludingPersonal().then(setPool)
  }, [])

  const items = useMemo(() => (unit ? unit.itemIds.map((id) => vocabById[id]).filter(Boolean) : []), [unit])

  // Once the concept explainer (if any) is dismissed, build the teach/quiz
  // plan: batch-teach new items, then quiz each batch back in shuffled
  // order — see lib/lessonPlan for why this beats "teach one, quiz it".
  useEffect(() => {
    if (!conceptDone || items.length === 0) return
    let cancelled = false
    Promise.all(items.map((item) => getProgress(item.id))).then((progressList) => {
      if (cancelled) return
      const isNewById = new Map(items.map((item, i) => [item.id, progressList[i].lastReviewedAt === null]))
      setPlan(buildLessonPlan(items, (id) => isNewById.get(id) ?? false))
    })
    return () => {
      cancelled = true
    }
  }, [conceptDone, items])

  const step = plan?.[stepIndex]
  const totalQuizSteps = plan ? countQuizSteps(plan) : 0
  const exerciseType = useMemo(
    () => (step?.item ? pickExerciseType(step.item, settings.speechEnabled, step.isNew) : 'multiple-choice'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step?.item.id, step?.type, settings.speechEnabled, step?.isNew],
  )

  if (!unit) {
    return (
      <div className="mx-auto max-w-md px-4 pt-4">
        <TopBar title="Lesson not found" onBack />
      </div>
    )
  }

  async function handleResult(result: ExerciseResult) {
    if (!step || !unit || !plan) return
    await recordAttempt({
      itemId: step.item.id,
      domain: step.item.domain,
      exerciseType: result.exerciseType,
      correct: result.correct,
      score: result.score,
    })
    const nextCorrect = correctCount + (result.correct ? 1 : 0)
    const nextAnswered = quizAnswered + 1
    setCorrectCount(nextCorrect)
    setQuizAnswered(nextAnswered)

    if (stepIndex + 1 >= plan.length) {
      await recordLessonResult({
        lessonId: unit.id,
        domain: unit.domain,
        startedAt,
        totalItems: totalQuizSteps,
        correctItems: nextCorrect,
      })
      const milestones = await checkAndRecordMilestones()
      setNewMilestones(milestones)
      setFinished(true)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  function advanceFromTeach() {
    setStepIndex((i) => i + 1)
  }

  if (finished) {
    const pct = totalQuizSteps === 0 ? 0 : Math.round((correctCount / totalQuizSteps) * 100)
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title={unit.title} onBack />
        <Card className="mt-6 text-center">
          <p className="text-sm text-slate-400">Lesson complete</p>
          <p className="mt-2 text-5xl font-bold text-amber-400">{percentageToLetterGrade(pct)}</p>
          <p className="mt-1 text-slate-300">
            {correctCount} / {totalQuizSteps} correct ({pct}%)
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
              setStepIndex(0)
              setQuizAnswered(0)
              setCorrectCount(0)
              setFinished(false)
              setNewMilestones([])
              setPlan(null)
              setConceptDone(!unit.concept)
            }}
          >
            Redo lesson
          </Button>
        </div>
      </div>
    )
  }

  if (unit.concept && !conceptDone) {
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title={unit.title} onBack />
        <div className="mt-3">
          <ConceptCard concept={unit.concept} onContinue={() => setConceptDone(true)} />
        </div>
      </div>
    )
  }

  if (!plan || !step) return null

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title={unit.title} onBack />
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
        <TeachCard item={step.item} onContinue={advanceFromTeach} />
      ) : (
        <Exercise key={`${step.item.id}-${stepIndex}`} item={step.item} distractorPool={pool} exerciseType={exerciseType} onResult={handleResult} />
      )}
    </div>
  )
}
