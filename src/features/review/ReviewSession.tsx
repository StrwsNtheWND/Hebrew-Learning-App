import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { ProgressBar } from '../../components/ProgressBar'
import { Exercise, pickExerciseType, type ExerciseResult } from '../lesson/Exercise'
import { getReviewQueue, getAllVocabIncludingPersonal, recordAttempt, checkAndRecordMilestones } from '../../lib/storage'
import { useSettings } from '../../state/SettingsContext'
import type { VocabItem } from '../../types/content'
import type { ItemProgress, MilestoneRecord } from '../../types/progress'

export function ReviewSession() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [queue, setQueue] = useState<{ item: VocabItem; progress: ItemProgress }[] | null>(null)
  const [pool, setPool] = useState<VocabItem[]>([])
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [newMilestones, setNewMilestones] = useState<MilestoneRecord[]>([])

  useEffect(() => {
    Promise.all([getReviewQueue({ limit: 20 }), getAllVocabIncludingPersonal()]).then(([q, p]) => {
      setQueue(q)
      setPool(p)
    })
  }, [])

  const current = queue?.[index]
  const exerciseType = useMemo(
    () => (current ? pickExerciseType(current.item, settings.speechEnabled) : 'multiple-choice'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.item.id, settings.speechEnabled],
  )

  async function handleResult(result: ExerciseResult) {
    if (!current || !queue) return
    await recordAttempt({
      itemId: current.item.id,
      domain: current.item.domain,
      exerciseType: result.exerciseType,
      correct: result.correct,
      score: result.score,
    })
    if (result.correct) setCorrectCount((c) => c + 1)

    if (index + 1 >= queue.length) {
      const milestones = await checkAndRecordMilestones()
      setNewMilestones(milestones)
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (queue === null) {
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
    const pct = Math.round((correctCount / queue.length) * 100)
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title="Review" onBack />
        <Card className="mt-6 text-center">
          <p className="text-sm text-slate-400">Session complete</p>
          <p className="mt-2 text-4xl font-bold text-amber-400">{pct}%</p>
          <p className="mt-1 text-slate-300">
            {correctCount} / {queue.length} correct
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

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title="Review" onBack />
      <div className="mt-3 mb-4">
        <ProgressBar value={(index / queue.length) * 100} />
        <p className="mt-1 text-xs text-slate-500">
          {index + 1} / {queue.length}
        </p>
      </div>
      {current && (
        <Exercise key={current.item.id} item={current.item} distractorPool={pool} exerciseType={exerciseType} onResult={handleResult} />
      )}
    </div>
  )
}
