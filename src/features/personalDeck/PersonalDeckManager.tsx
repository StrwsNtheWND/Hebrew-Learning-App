import { useEffect, useState } from 'react'
import { TopBar } from '../../components/TopBar'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { addPersonalItem, deletePersonalItem, listPersonalItems } from '../../lib/storage'
import { DOMAIN_LABELS, type Domain } from '../../types/content'
import type { PersonalDeckItem } from '../../types/progress'

const DOMAIN_OPTIONS: Domain[] = [
  'site-safety',
  'blueprints-permits',
  'subcontractors',
  'budgeting-scheduling',
  'client-inspector',
  'site-talk',
  'banking-finance',
  'housing',
  'bureaucracy',
  'daily-life',
]

export function PersonalDeckManager() {
  const [items, setItems] = useState<PersonalDeckItem[]>([])
  const [hebrew, setHebrew] = useState('')
  const [transliteration, setTransliteration] = useState('')
  const [english, setEnglish] = useState('')
  const [notes, setNotes] = useState('')
  const [domain, setDomain] = useState<Domain>('site-talk')
  const [saving, setSaving] = useState(false)

  function refresh() {
    listPersonalItems().then(setItems)
  }

  useEffect(refresh, [])

  async function submit() {
    if (!hebrew.trim() || !english.trim()) return
    setSaving(true)
    await addPersonalItem({ hebrew: hebrew.trim(), transliteration: transliteration.trim(), english: english.trim(), notes: notes.trim() || undefined, domain })
    setHebrew('')
    setTransliteration('')
    setEnglish('')
    setNotes('')
    setSaving(false)
    refresh()
  }

  async function remove(id: string) {
    await deletePersonalItem(id)
    refresh()
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title="My Words" />
      <p className="mt-3 mb-4 text-sm text-slate-400">
        Add words and phrases you pick up on the job. They'll join your regular review queue.
      </p>

      <Card>
        <div className="space-y-2">
          <input
            dir="rtl"
            value={hebrew}
            onChange={(e) => setHebrew(e.target.value)}
            placeholder="עברית"
            className="font-hebrew w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-lg text-slate-50 outline-none focus:border-amber-500"
          />
          <input
            value={transliteration}
            onChange={(e) => setTransliteration(e.target.value)}
            placeholder="Transliteration"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
          />
          <input
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="English meaning"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
          />
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as Domain)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
          >
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {DOMAIN_LABELS[d]}
              </option>
            ))}
          </select>
          <Button fullWidth onClick={submit} disabled={saving || !hebrew.trim() || !english.trim()}>
            Add to my deck
          </Button>
        </div>
      </Card>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Your words ({items.length})
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-hebrew text-lg text-slate-50" dir="rtl">
                {item.hebrew}
              </p>
              <p className="text-xs text-slate-500">
                {item.transliteration} — {item.english}
              </p>
              <p className="mt-0.5 text-[11px] text-amber-500/80">{DOMAIN_LABELS[item.domain]}</p>
            </div>
            <button onClick={() => remove(item.id)} className="text-xs text-red-400 hover:text-red-300" aria-label="Delete">
              ✕
            </button>
          </Card>
        ))}
        {items.length === 0 && <Card><p className="text-xs text-slate-600">No personal words yet — add your first above.</p></Card>}
      </div>
    </div>
  )
}
