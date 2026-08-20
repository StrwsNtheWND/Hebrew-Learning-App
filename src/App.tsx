import { HashRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider, useSettings } from './state/SettingsContext'
import { BottomNav } from './components/BottomNav'
import { Onboarding } from './features/onboarding/Onboarding'
import { Dashboard } from './features/dashboard/Dashboard'
import { ReviewSession } from './features/review/ReviewSession'
import { LessonRunner } from './features/lesson/LessonRunner'
import { ScenarioList } from './features/scenarios/ScenarioList'
import { ScenarioPlayer } from './features/scenarios/ScenarioPlayer'
import { StatsPage } from './features/stats/StatsPage'
import { PersonalDeckManager } from './features/personalDeck/PersonalDeckManager'
import { SettingsPage } from './features/settings/SettingsPage'

function AppShell() {
  const { settings, loading } = useSettings()

  if (loading) return null

  if (!settings.onboardingComplete) {
    return <Onboarding />
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/review" element={<ReviewSession />} />
        <Route path="/lesson/:lessonId" element={<LessonRunner />} />
        <Route path="/scenarios" element={<ScenarioList />} />
        <Route path="/scenarios/:scenarioId" element={<ScenarioPlayer />} />
        <Route path="/deck" element={<PersonalDeckManager />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </HashRouter>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  )
}
