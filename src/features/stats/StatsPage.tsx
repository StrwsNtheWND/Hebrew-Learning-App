import { useEffect, useState } from 'react'
import { TopBar } from '../../components/TopBar'
import { Card } from '../../components/Card'
import {
  getDashboardStats,
  getDomainSkills,
  getHistoricalDailyStats,
  getMilestoneHistory,
  getLessonResults,
  type DashboardStats,
} from '../../lib/storage'
import { DOMAIN_LABELS } from '../../types/content'
import { BAND_LABELS } from '../../lib/adaptiveDifficulty'
import type { DomainSkill, MilestoneRecord, LessonResult, DailyStat } from '../../types/progress'

export function StatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [domainSkills, setDomainSkills] = useState<DomainSkill[]>([])
  const [history, setHistory] = useState<DailyStat[]>([])
  const [milestones, setMilestones] = useState<MilestoneRecord[]>([])
  const [lessonResults, setLessonResults] = useState<LessonResult[]>([])

  useEffect(() => {
    Promise.all([getDashboardStats(), getDomainSkills(), getHistoricalDailyStats(14), getMilestoneHistory(), getLessonResults()]).then(
      ([s, d, h, m, l]) => {
        setStats(s)
        setDomainSkills(d)
        setHistory(h)
        setMilestones(m)
        setLessonResults(l.slice(0, 10))
      },
    )
  }, [])

  const maxReviewed = Math.max(1, ...history.map((h) => h.itemsReviewed))

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title="Your Progress" />

      {stats && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Card><p className="text-xs text-slate-500">Words mastered</p><p className="text-2xl font-bold text-slate-50">{stats.wordsMastered}</p></Card>
          <Card><p className="text-xs text-slate-500">In progress</p><p className="text-2xl font-bold text-slate-50">{stats.wordsInProgress}</p></Card>
          <Card><p className="text-xs text-slate-500">Current streak</p><p className="text-2xl font-bold text-slate-50">{stats.currentStreak}d</p></Card>
          <Card><p className="text-xs text-slate-500">Longest streak</p><p className="text-2xl font-bold text-slate-50">{stats.longestStreak}d</p></Card>
          <Card><p className="text-xs text-slate-500">Lessons completed</p><p className="text-2xl font-bold text-slate-50">{stats.lessonsCompleted}</p></Card>
          <Card><p className="text-xs text-slate-500">Conversations done</p><p className="text-2xl font-bold text-slate-50">{stats.scenariosCompleted}</p></Card>
        </div>
      )}

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Last 14 days</h3>
      <Card>
        <div className="flex h-24 items-end gap-1">
          {history.length === 0 && <p className="text-xs text-slate-600">No activity logged yet.</p>}
          {history.map((h) => (
            <div key={h.date} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full rounded-t bg-amber-500/70"
                style={{ height: `${Math.max(4, (h.itemsReviewed / maxReviewed) * 100)}%` }}
                title={`${h.date}: ${h.itemsReviewed} reviewed`}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-600">Items reviewed per day</p>
      </Card>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Skill by topic</h3>
      <div className="space-y-2">
        {domainSkills.length === 0 && (
          <Card><p className="text-xs text-slate-600">Complete a few lessons to see topic-level accuracy.</p></Card>
        )}
        {domainSkills
          .sort((a, b) => b.rollingAccuracy - a.rollingAccuracy)
          .map((d) => (
            <Card key={d.domain}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-100">{DOMAIN_LABELS[d.domain]}</p>
                <p className="text-xs text-slate-500">{Math.round(d.rollingAccuracy * 100)}%</p>
              </div>
              <p className="mt-0.5 text-[11px] text-amber-500/80">{BAND_LABELS[d.currentBand]}</p>
            </Card>
          ))}
      </div>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Recent lesson grades</h3>
      <div className="space-y-2">
        {lessonResults.length === 0 && <Card><p className="text-xs text-slate-600">No lessons completed yet.</p></Card>}
        {lessonResults.map((r) => (
          <Card key={r.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">{DOMAIN_LABELS[r.domain]}</p>
              <p className="text-[11px] text-slate-500">{new Date(r.finishedAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-400">{r.letterGrade}</p>
              <p className="text-[11px] text-slate-500">{r.percentage}%</p>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Milestones</h3>
      <div className="space-y-2">
        {milestones.length === 0 && <Card><p className="text-xs text-slate-600">Keep practicing — your first milestone is close.</p></Card>}
        {milestones.map((m) => (
          <Card key={m.id}>
            <p className="text-sm font-semibold text-amber-300">🏅 {m.label}</p>
            <p className="text-xs text-slate-500">{m.detail}</p>
            <p className="mt-1 text-[11px] text-slate-600">{new Date(m.achievedAt).toLocaleDateString()}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
