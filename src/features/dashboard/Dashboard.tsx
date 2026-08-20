import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { ProgressBar } from '../../components/ProgressBar'
import { useSettings } from '../../state/SettingsContext'
import { lessonUnits } from '../../content'
import { DOMAIN_LABELS } from '../../types/content'
import {
  getDashboardStats,
  getReviewQueue,
  getLessonUnitProgress,
  type DashboardStats,
} from '../../lib/storage'

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  if (Number.isNaN(target.getTime())) return null
  const diff = target.getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

export function Dashboard() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [dueCount, setDueCount] = useState(0)
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [s, queue] = await Promise.all([getDashboardStats(), getReviewQueue({ limit: 200 })])
      if (cancelled) return
      setStats(s)
      setDueCount(queue.length)

      const entries = await Promise.all(
        lessonUnits.map(async (unit) => {
          const p = await getLessonUnitProgress(unit.id)
          return [unit.id, p?.avgMastery ?? 0] as const
        }),
      )
      if (!cancelled) setLessonProgress(Object.fromEntries(entries))
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const move = daysUntil(settings.moveDate)
  const vocabLessons = lessonUnits.filter((u) => u.domain !== 'binyanim')
  const binyanLessons = lessonUnits.filter((u) => u.domain === 'binyanim')

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            {settings.displayName ? `Shalom, ${settings.displayName}` : 'Shalom'}
          </h2>
          {move !== null && (
            <p className="mt-0.5 text-sm text-slate-400">
              {move > 0 ? `${move} days until your move to Israel` : 'Your move date has arrived — behatzlacha! 🎉'}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/deck')}
          className="shrink-0 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 active:bg-slate-800"
        >
          My Words
        </button>
      </div>

      <Card className="mb-4 bg-gradient-to-br from-amber-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Ready to review</p>
            <p className="text-3xl font-bold text-slate-50">{dueCount}</p>
            <p className="text-xs text-slate-500">words &amp; phrases due</p>
          </div>
          <Button onClick={() => navigate('/review')} disabled={dueCount === 0}>
            Start review
          </Button>
        </div>
      </Card>

      {stats && (
        <div className="mb-5 grid grid-cols-3 gap-2">
          <StatTile label="Streak" value={`${stats.currentStreak}d`} sub={`best ${stats.longestStreak}d`} />
          <StatTile label="Mastered" value={String(stats.wordsMastered)} sub={`of ${stats.totalWordsAvailable}`} />
          <StatTile label="Lessons" value={String(stats.lessonsCompleted)} sub={`of ${lessonUnits.length}`} />
        </div>
      )}

      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Vocabulary Lessons</h3>
      <LessonList units={vocabLessons} progress={lessonProgress} onOpen={(id) => navigate(`/lesson/${id}`)} />

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Verb Patterns (Binyanim)
      </h3>
      <p className="mb-2 text-xs text-slate-500">
        Learn the 7 templates Hebrew verbs are built from — each lesson explains the pattern before quizzing it.
      </p>
      <LessonList units={binyanLessons} progress={lessonProgress} onOpen={(id) => navigate(`/lesson/${id}`)} />
    </div>
  )
}

function LessonList({
  units,
  progress,
  onOpen,
}: {
  units: typeof lessonUnits
  progress: Record<string, number>
  onOpen: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      {units.map((unit) => (
        <button key={unit.id} onClick={() => onOpen(unit.id)} className="block w-full text-left">
          <Card className="hover:border-amber-500/40">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-100">{unit.title}</p>
                <p className="truncate text-xs text-slate-500">{DOMAIN_LABELS[unit.domain]}</p>
                <ProgressBar value={progress[unit.id] ?? 0} className="mt-2" />
              </div>
              <span className="text-xs font-medium text-slate-400">{Math.round(progress[unit.id] ?? 0)}%</span>
            </div>
          </Card>
        </button>
      ))}
    </div>
  )
}

function StatTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card className="text-center">
      <p className="text-lg font-bold text-slate-50">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-[11px] text-slate-600">{sub}</p>
    </Card>
  )
}
