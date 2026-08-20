import { useState } from 'react'
import { TopBar } from '../../components/TopBar'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useSettings } from '../../state/SettingsContext'
import { isCloudConfigured } from '../../lib/supabaseClient'
import { signInWithEmail, pushToCloud, pullFromCloud } from '../../lib/sync'
import { isAiConfigured, saveAnthropicApiKey, clearAnthropicApiKey } from '../../lib/ai'
import { speechRecognitionSupported, speechSynthesisSupported } from '../../lib/speech'
import { resetAllProgress } from '../../lib/storage'

function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span>
        <span className="block text-sm text-slate-100">{label}</span>
        {sub && <span className="block text-xs text-slate-500">{sub}</span>}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}

export function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [email, setEmail] = useState('')
  const [authStatus, setAuthStatus] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [apiKeyStatus, setApiKeyStatus] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleSignIn() {
    setAuthStatus('Sending magic link…')
    const { error } = await signInWithEmail(email)
    setAuthStatus(error ?? 'Check your email for a sign-in link.')
  }

  async function handlePush() {
    setSyncStatus('Backing up…')
    const { error } = await pushToCloud()
    setSyncStatus(error ?? 'Backed up to the cloud.')
    if (!error) await updateSettings({ supabaseSyncEnabled: true })
  }

  async function handlePull() {
    setSyncStatus('Restoring…')
    const { error } = await pullFromCloud()
    setSyncStatus(error ?? 'Restored from the cloud. Reloading…')
    if (!error) setTimeout(() => window.location.reload(), 800)
  }

  async function handleSaveKey() {
    setApiKeyStatus('Saving…')
    const { error } = await saveAnthropicApiKey(apiKey.trim())
    setApiKeyStatus(error ?? 'Saved.')
    if (!error) {
      setApiKey('')
      await updateSettings({ aiFeaturesEnabled: true, anthropicApiKeyStored: true })
    }
  }

  async function handleClearKey() {
    await clearAnthropicApiKey()
    await updateSettings({ aiFeaturesEnabled: false, anthropicApiKeyStored: false })
    setApiKeyStatus('Removed.')
  }

  async function handleResetProgress() {
    if (!confirmingReset) {
      setConfirmingReset(true)
      return
    }
    setResetting(true)
    await resetAllProgress()
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title="Settings" />

      <h3 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Profile</h3>
      <Card>
        <label className="block text-xs text-slate-500">Display name</label>
        <input
          value={settings.displayName}
          onChange={(e) => updateSettings({ displayName: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
        />
        <label className="mt-3 block text-xs text-slate-500">Move-to-Israel date</label>
        <input
          type="date"
          value={settings.moveDate}
          onChange={(e) => updateSettings({ moveDate: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
        />
        <label className="mt-3 block text-xs text-slate-500">Daily goal (minutes)</label>
        <input
          type="number"
          min={5}
          max={60}
          value={settings.dailyGoalMinutes}
          onChange={(e) => updateSettings({ dailyGoalMinutes: Number(e.target.value) })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
        />
      </Card>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Learning</h3>
      <Card>
        <Toggle
          checked={settings.showNikkud}
          onChange={(v) => updateSettings({ showNikkud: v })}
          label="Show nikkud (vowel points)"
          sub="Off by default — most real-world Hebrew you'll read has none."
        />
        <div className="border-t border-slate-800" />
        <Toggle
          checked={settings.speechEnabled}
          onChange={(v) => updateSettings({ speechEnabled: v })}
          label="Speech exercises"
          sub={
            speechSynthesisSupported()
              ? speechRecognitionSupported()
                ? 'Text-to-speech and speech recognition available on this device.'
                : 'Text-to-speech available; speech recognition not supported here (common on iOS Safari).'
              : 'Not supported on this device/browser.'
          }
        />
      </Card>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Cloud Sync</h3>
      <Card>
        {isCloudConfigured() ? (
          <>
            <p className="text-xs text-slate-500">Sign in to back up and sync your progress across devices.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
            />
            <Button className="mt-2" fullWidth variant="secondary" onClick={handleSignIn} disabled={!email.trim()}>
              Send magic link
            </Button>
            {authStatus && <p className="mt-2 text-xs text-slate-500">{authStatus}</p>}
            <div className="mt-4 flex gap-2">
              <Button fullWidth variant="secondary" onClick={handlePush}>
                Back up now
              </Button>
              <Button fullWidth variant="secondary" onClick={handlePull}>
                Restore
              </Button>
            </div>
            {syncStatus && <p className="mt-2 text-xs text-slate-500">{syncStatus}</p>}
          </>
        ) : (
          <p className="text-xs text-slate-500">
            Cloud sync isn't configured yet. See the README ("Cloud sync setup") for how to create a free Supabase
            project and connect it — until then, your progress is saved locally on this device.
          </p>
        )}
      </Card>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">AI Features (optional)</h3>
      <Card>
        {isAiConfigured() ? (
          <>
            <p className="text-xs text-slate-500">
              Add your own Anthropic API key to unlock freeform mock-conversation replies and smarter grading of
              open-ended answers. Your key is stored securely and only used server-side. Typical cost for 10-15
              min/day of use is a few dollars a month — you control spend directly at{' '}
              <span className="text-slate-400">console.anthropic.com</span>.
            </p>
            {settings.anthropicApiKeyStored ? (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-emerald-400">API key on file</p>
                <Button variant="danger" onClick={handleClearKey}>
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-500"
                />
                <Button className="mt-2" fullWidth onClick={handleSaveKey} disabled={!apiKey.trim()}>
                  Save key
                </Button>
              </>
            )}
            {apiKeyStatus && <p className="mt-2 text-xs text-slate-500">{apiKeyStatus}</p>}
          </>
        ) : (
          <p className="text-xs text-slate-500">
            AI features need cloud sync configured first (they use a Supabase Edge Function as a secure proxy — see
            README "AI features setup"). Everything else in the app works fully without this.
          </p>
        )}
      </Card>

      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Danger Zone</h3>
      <Card className="border-red-900/60">
        <p className="text-xs text-slate-500">
          Clears every word's mastery, streaks, lesson grades, and milestone history so everything gets taught again
          before it's quizzed — as if you were starting fresh. Your added personal words and profile settings are
          kept. Mainly useful if a lot of progress got recorded before you actually learned those words (e.g. while
          trying the app out).
        </p>
        {confirmingReset ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-red-300">
              Are you sure? This can't be undone{settings.supabaseSyncEnabled ? ' (back up first if you want to keep it)' : ''}.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" fullWidth onClick={() => setConfirmingReset(false)} disabled={resetting}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth onClick={handleResetProgress} disabled={resetting}>
                {resetting ? 'Resetting…' : 'Yes, reset everything'}
              </Button>
            </div>
          </div>
        ) : (
          <Button className="mt-3" variant="danger" fullWidth onClick={handleResetProgress}>
            Reset all learning progress
          </Button>
        )}
      </Card>
    </div>
  )
}
