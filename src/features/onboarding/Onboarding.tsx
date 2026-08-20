import { useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { useSettings } from '../../state/SettingsContext'

export function Onboarding() {
  const { updateSettings } = useSettings()
  const [name, setName] = useState('')
  const [moveDate, setMoveDate] = useState('')

  async function finish() {
    // Flipping onboardingComplete re-renders AppShell (same context) straight
    // into the main app — no separate navigation/callback needed.
    await updateSettings({ displayName: name.trim(), moveDate, onboardingComplete: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <p className="font-hebrew text-5xl text-amber-400">אֲדֹנִי</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-50">Ivrit Avoda</h1>
        <p className="mt-2 text-sm text-slate-400">Hebrew for the job site, the office, and daily life in Israel.</p>
      </div>

      <Card>
        <label className="block text-xs text-slate-500">What should we call you?</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-amber-500"
        />
        <label className="mt-4 block text-xs text-slate-500">When are you moving to Israel? (optional)</label>
        <input
          type="date"
          value={moveDate}
          onChange={(e) => setMoveDate(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-amber-500"
        />
      </Card>

      <p className="mt-4 text-center text-xs text-slate-500">
        Built around construction &amp; property-management work — site safety, permits, subcontractors, client
        updates — plus the everyday Hebrew you'll need for life there.
      </p>

      <Button className="mt-6" fullWidth onClick={finish}>
        Let's start
      </Button>
    </div>
  )
}
