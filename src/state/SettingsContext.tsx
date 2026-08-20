import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_SETTINGS, type UserSettings } from '../types/progress'
import { loadSettings, saveSettings } from '../lib/db'

interface SettingsContextValue {
  settings: UserSettings
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>
  loading: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings(DEFAULT_SETTINGS).then((s) => {
      setSettings(s)
      setLoading(false)
    })
  }, [])

  async function updateSettings(patch: Partial<UserSettings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    await saveSettings(next)
  }

  return <SettingsContext.Provider value={{ settings, updateSettings, loading }}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
