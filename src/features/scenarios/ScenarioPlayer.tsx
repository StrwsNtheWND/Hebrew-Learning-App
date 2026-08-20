import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { scenarios } from '../../content'
import type { ScenarioTurn } from '../../types/content'
import { gradeAnswer } from '../../lib/grading'
import { speakHebrew, speechRecognitionSupported, listenOnce } from '../../lib/speech'
import { recordScenarioCompletion, checkAndRecordMilestones } from '../../lib/storage'
import { useSettings } from '../../state/SettingsContext'
import { isAiConfigured, getFreeformReply } from '../../lib/ai'
import type { MilestoneRecord } from '../../types/progress'

type LogEntry = { speaker: 'them' | 'you'; hebrew: string; english: string }

export function ScenarioPlayer() {
  const { scenarioId } = useParams<{ scenarioId: string }>()
  const navigate = useNavigate()
  const { settings } = useSettings()
  const scenario = scenarios.find((s) => s.id === scenarioId)

  const [currentTurnId, setCurrentTurnId] = useState(scenario?.startTurnId ?? '')
  const [log, setLog] = useState<LogEntry[]>([])
  const [totalGraded, setTotalGraded] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [ended, setEnded] = useState(false)
  const [newMilestones, setNewMilestones] = useState<MilestoneRecord[]>([])
  const [aiMode, setAiMode] = useState(false)
  const [aiLog, setAiLog] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const turnsById = new Map(scenario?.turns.map((t) => [t.id, t]) ?? [])
  const currentTurn = turnsById.get(currentTurnId)

  // Guards against double-logging the same turn — React StrictMode (dev)
  // deliberately double-invokes effects, and this effect's job is to append
  // to an array, which isn't naturally idempotent under that.
  const loggedTurnIds = useRef(new Set<string>())

  useEffect(() => {
    if (currentTurn?.speaker === 'them' && !loggedTurnIds.current.has(currentTurn.id)) {
      loggedTurnIds.current.add(currentTurn.id)
      const t = setTimeout(() => speakHebrew(currentTurn.hebrew), 400)
      setLog((prev) => [...prev, { speaker: 'them', hebrew: currentTurn.hebrew, english: currentTurn.english }])
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnId])

  if (!scenario) {
    return (
      <div className="mx-auto max-w-md px-4 pt-4">
        <TopBar title="Scenario not found" onBack />
      </div>
    )
  }

  function advanceTo(nextId: string | null) {
    if (!nextId) {
      finish()
      return
    }
    setCurrentTurnId(nextId)
  }

  function nextSequentialId(turn: ScenarioTurn): string | null {
    const idx = scenario!.turns.findIndex((t) => t.id === turn.id)
    return scenario!.turns[idx + 1]?.id ?? null
  }

  async function finish() {
    await recordScenarioCompletion({
      scenarioId: scenario!.id,
      domain: scenario!.domain,
      correct: totalGraded === 0 || totalCorrect / totalGraded >= 0.6,
      score: totalGraded === 0 ? 1 : totalCorrect / totalGraded,
    })
    const milestones = await checkAndRecordMilestones()
    setNewMilestones(milestones)
    setEnded(true)
  }

  function handleBranchChoice(choiceHebrew: string, choiceEnglish: string, nextTurnId: string) {
    setLog((prev) => [...prev, { speaker: 'you', hebrew: choiceHebrew, english: choiceEnglish }])
    advanceTo(nextTurnId)
  }

  function handleFreeAnswerGraded(correct: boolean, hebrewSaid: string, target: ScenarioTurn) {
    setTotalGraded((n) => n + 1)
    if (correct) setTotalCorrect((n) => n + 1)
    setLog((prev) => [...prev, { speaker: 'you', hebrew: hebrewSaid || target.english, english: target.english }])
    const next = nextSequentialId(target)
    advanceTo(next)
  }

  async function sendAiMessage() {
    if (!aiInput.trim()) return
    const userMsg = { role: 'user' as const, content: aiInput.trim() }
    const history = [...aiLog, userMsg]
    setAiLog(history)
    setAiInput('')
    setAiLoading(true)
    try {
      const reply = await getFreeformReply(scenario!.title, scenario!.register, history)
      setAiLog((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setAiLog((prev) => [...prev, { role: 'assistant', content: `(error: ${(err as Error).message})` }])
    } finally {
      setAiLoading(false)
    }
  }

  if (ended) {
    const pct = totalGraded === 0 ? 100 : Math.round((totalCorrect / totalGraded) * 100)
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <TopBar title={scenario.title} onBack />
        <Card className="mt-6 text-center">
          <p className="text-sm text-slate-400">Conversation complete</p>
          <p className="mt-2 text-4xl font-bold text-amber-400">{pct}%</p>
          <p className="mt-1 text-slate-300">
            {totalCorrect} / {totalGraded} responses on target
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

        {isAiConfigured() && settings.aiFeaturesEnabled && !aiMode && (
          <Button className="mt-4" variant="secondary" fullWidth onClick={() => setAiMode(true)}>
            Keep going in freeform AI conversation
          </Button>
        )}

        {aiMode && (
          <Card className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Freeform practice</p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {aiLog.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <p
                    className={`inline-block rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-amber-500/20 text-amber-100' : 'bg-slate-800 text-slate-200'}`}
                    dir={m.role === 'assistant' ? 'rtl' : 'auto'}
                  >
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                dir="rtl"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendAiMessage()}
                placeholder="הקלד תגובה..."
                className="font-hebrew flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-amber-500"
              />
              <Button onClick={sendAiMessage} disabled={aiLoading}>
                Send
              </Button>
            </div>
          </Card>
        )}

        <Button className="mt-6" fullWidth onClick={() => navigate('/scenarios')}>
          Back to conversations
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title={scenario.title} onBack />
      <p className="mt-2 mb-3 text-xs text-slate-500">{scenario.setup}</p>

      <div className="space-y-3">
        {log.map((entry, i) => (
          <div key={i} className={entry.speaker === 'you' ? 'text-right' : 'text-left'}>
            <p className="text-[11px] uppercase tracking-wide text-slate-600">{entry.speaker === 'you' ? 'You' : 'Them'}</p>
            <p
              className={`font-hebrew inline-block rounded-xl px-3 py-2 text-lg ${entry.speaker === 'you' ? 'bg-amber-500/15 text-amber-100' : 'bg-slate-800 text-slate-100'}`}
              dir="rtl"
            >
              {entry.hebrew}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{entry.english}</p>
          </div>
        ))}
      </div>

      {currentTurn?.speaker === 'them' && (
        <Button className="mt-5" fullWidth onClick={() => advanceTo(nextSequentialId(currentTurn))}>
          Continue
        </Button>
      )}

      {currentTurn?.speaker === 'you' && currentTurn.branches && (
        <div className="mt-5 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">How do you respond?</p>
          {currentTurn.branches.map((b, i) => (
            <button
              key={i}
              onClick={() => handleBranchChoice(b.choiceHebrew, b.choiceEnglish, b.nextTurnId)}
              className="block w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-right active:bg-slate-800"
            >
              <span className="font-hebrew block text-lg text-slate-50" dir="rtl">
                {b.choiceHebrew}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">{b.choiceEnglish}</span>
            </button>
          ))}
        </div>
      )}

      {currentTurn?.speaker === 'you' && !currentTurn.branches && (
        <YourTurnInput turn={currentTurn} onGraded={handleFreeAnswerGraded} />
      )}
    </div>
  )
}

function YourTurnInput({
  turn,
  onGraded,
}: {
  turn: ScenarioTurn
  onGraded: (correct: boolean, hebrewSaid: string, turn: ScenarioTurn) => void
}) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<{ correct: boolean; bestMatch: string } | null>(null)
  const [listening, setListening] = useState(false)

  function check(text: string) {
    const graded = gradeAnswer(text, turn.acceptableResponses ?? [])
    setChecked(graded)
  }

  async function record() {
    setListening(true)
    try {
      const result = await listenOnce()
      setValue(result.transcript)
      check(result.transcript)
    } catch {
      // ignore — user can type instead
    } finally {
      setListening(false)
    }
  }

  return (
    <Card className="mt-5">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Your turn: {turn.english}</p>
      <input
        dir="rtl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check(value)}
        disabled={checked !== null}
        placeholder="הקלד את התשובה..."
        className="font-hebrew w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg text-slate-50 outline-none focus:border-amber-500 disabled:opacity-60"
      />
      <div className="mt-3 flex gap-2">
        {speechRecognitionSupported() && (
          <Button variant="secondary" onClick={record} disabled={listening || checked !== null}>
            {listening ? 'Listening…' : '🎙️ Speak'}
          </Button>
        )}
        {!checked && (
          <Button fullWidth onClick={() => check(value)} disabled={value.trim().length === 0}>
            Check
          </Button>
        )}
      </div>
      {checked && (
        <div className="mt-3">
          <p className={`text-sm ${checked.correct ? 'text-emerald-400' : 'text-amber-400'}`}>
            {checked.correct ? 'On target!' : `Try to work in: "${turn.acceptableResponses?.[0]}"`}
          </p>
          <Button className="mt-3" fullWidth onClick={() => onGraded(checked.correct, value, turn)}>
            Continue
          </Button>
        </div>
      )}
    </Card>
  )
}
