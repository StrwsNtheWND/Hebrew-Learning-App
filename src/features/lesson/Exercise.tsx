import { useEffect, useMemo, useState } from 'react'
import type { VocabItem } from '../../types/content'
import type { ExerciseType } from '../../types/progress'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { HebrewText } from '../../components/HebrewText'
import { gradeAnswer } from '../../lib/grading'
import { speakHebrew, speechRecognitionSupported, listenOnce } from '../../lib/speech'
import { useSettings } from '../../state/SettingsContext'

export interface ExerciseResult {
  exerciseType: ExerciseType
  correct: boolean
  score: number
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * The first time an item is quizzed (right after its TeachCard), stick to
 * recognition — multiple-choice / listening — rather than production
 * (typed / speaking). Recalling a word you just saw once by ear or by sight
 * is reasonable; typing or speaking it correctly from memory usually isn't.
 * Production exercises unlock once the item has been reviewed before.
 */
export function pickExerciseType(item: VocabItem, speechEnabled: boolean, isNew = false): ExerciseType {
  if (isNew) {
    if (item.kind === 'sentence') return 'listening'
    return speechEnabled && Math.random() > 0.5 ? 'listening' : 'multiple-choice'
  }

  const pool: ExerciseType[] = ['multiple-choice', 'typed']
  if (speechEnabled) pool.push('listening')
  if (speechEnabled && speechRecognitionSupported()) pool.push('speaking')
  // Sentences are awkward as multiple-choice; bias longer items toward typed/listening.
  if (item.kind === 'sentence') return pool.includes('listening') && Math.random() > 0.5 ? 'listening' : 'typed'
  return pool[Math.floor(Math.random() * pool.length)]
}

export function Exercise({
  item,
  distractorPool,
  exerciseType,
  onResult,
}: {
  item: VocabItem
  distractorPool: VocabItem[]
  exerciseType: ExerciseType
  onResult: (result: ExerciseResult) => void
}) {
  switch (exerciseType) {
    case 'multiple-choice':
      return <MultipleChoice item={item} distractorPool={distractorPool} onResult={onResult} />
    case 'listening':
      return <Listening item={item} distractorPool={distractorPool} onResult={onResult} />
    case 'speaking':
      return <Speaking item={item} onResult={onResult} />
    default:
      return <Typed item={item} onResult={onResult} />
  }
}

function useOptions(item: VocabItem, pool: VocabItem[]) {
  return useMemo(() => {
    const sameDomain = pool.filter((p) => p.domain === item.domain && p.id !== item.id)
    const others = pool.filter((p) => p.domain !== item.domain && p.id !== item.id)
    const distractors = shuffle([...sameDomain, ...others]).slice(0, 3)
    return shuffle([item, ...distractors])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, pool])
}

function MultipleChoice({
  item,
  distractorPool,
  onResult,
}: {
  item: VocabItem
  distractorPool: VocabItem[]
  onResult: (r: ExerciseResult) => void
}) {
  const options = useOptions(item, distractorPool)
  const [picked, setPicked] = useState<string | null>(null)

  function choose(optionId: string) {
    if (picked) return
    setPicked(optionId)
    const correct = optionId === item.id
    setTimeout(() => onResult({ exerciseType: 'multiple-choice', correct, score: correct ? 1 : 0 }), 650)
  }

  return (
    <Card>
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">What does this mean?</p>
      <HebrewText hebrew={item.hebrew} hebrewNikkud={item.hebrewNikkud} transliteration={item.transliteration} />
      <div className="mt-5 grid grid-cols-1 gap-2">
        {options.map((opt) => {
          const isPicked = picked === opt.id
          const isCorrectOpt = opt.id === item.id
          const showState = picked !== null
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={picked !== null}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                showState && isCorrectOpt
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : showState && isPicked
                    ? 'border-red-500 bg-red-500/10 text-red-300'
                    : 'border-slate-800 bg-slate-900 text-slate-200 active:bg-slate-800'
              }`}
            >
              {opt.english}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function Listening({
  item,
  distractorPool,
  onResult,
}: {
  item: VocabItem
  distractorPool: VocabItem[]
  onResult: (r: ExerciseResult) => void
}) {
  const options = useOptions(item, distractorPool)
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => speakHebrew(item.hebrew), 300)
    return () => clearTimeout(t)
  }, [item])

  function choose(optionId: string) {
    if (picked) return
    setPicked(optionId)
    const correct = optionId === item.id
    setTimeout(() => onResult({ exerciseType: 'listening', correct, score: correct ? 1 : 0 }), 650)
  }

  return (
    <Card>
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Listen and choose the meaning</p>
      <div className="flex justify-center">
        <button
          onClick={() => speakHebrew(item.hebrew)}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-4xl text-amber-400 active:scale-95"
          aria-label="Play again"
        >
          🔊
        </button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2">
        {options.map((opt) => {
          const isPicked = picked === opt.id
          const isCorrectOpt = opt.id === item.id
          const showState = picked !== null
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={picked !== null}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                showState && isCorrectOpt
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : showState && isPicked
                    ? 'border-red-500 bg-red-500/10 text-red-300'
                    : 'border-slate-800 bg-slate-900 text-slate-200 active:bg-slate-800'
              }`}
            >
              {opt.english}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function Typed({ item, onResult }: { item: VocabItem; onResult: (r: ExerciseResult) => void }) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<{ correct: boolean; score: number } | null>(null)

  function check() {
    if (checked) return
    const graded = gradeAnswer(value, [item.hebrew, item.hebrewNikkud ?? item.hebrew])
    setChecked(graded)
    setTimeout(() => onResult({ exerciseType: 'typed', correct: graded.correct, score: graded.score }), 900)
  }

  return (
    <Card>
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Type this in Hebrew</p>
      <p className="mb-4 text-lg text-slate-100">{item.english}</p>
      <input
        dir="rtl"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        disabled={checked !== null}
        placeholder="הקלד כאן..."
        className="font-hebrew w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xl text-slate-50 outline-none focus:border-amber-500 disabled:opacity-60"
      />
      {checked && (
        <p className={`mt-3 text-sm ${checked.correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {checked.correct ? 'Correct!' : `Answer: ${item.hebrew} (${item.transliteration})`}
        </p>
      )}
      {!checked && (
        <Button className="mt-4" fullWidth onClick={check} disabled={value.trim().length === 0}>
          Check
        </Button>
      )}
    </Card>
  )
}

function Speaking({ item, onResult }: { item: VocabItem; onResult: (r: ExerciseResult) => void }) {
  const { settings } = useSettings()
  const [state, setState] = useState<'idle' | 'listening' | 'done' | 'unsupported'>(
    speechRecognitionSupported() ? 'idle' : 'unsupported',
  )
  const [heard, setHeard] = useState('')
  const [graded, setGraded] = useState<{ correct: boolean; score: number } | null>(null)
  const [recordError, setRecordError] = useState(false)

  async function record() {
    setState('listening')
    setRecordError(false)
    try {
      const result = await listenOnce()
      setHeard(result.transcript)
      const g = gradeAnswer(result.transcript, [item.hebrew, item.hebrewNikkud ?? item.hebrew], { passThreshold: 0.7 })
      setGraded(g)
      setState('done')
      setTimeout(() => onResult({ exerciseType: 'speaking', correct: g.correct, score: g.score }), 1100)
    } catch {
      // Mic denied, no speech detected, or unsupported in practice despite
      // the API existing — fall back to self-report rather than stranding
      // the user with no way to continue.
      setRecordError(true)
      setState('idle')
    }
  }

  function selfReport(correct: boolean) {
    setGraded({ correct, score: correct ? 1 : 0 })
    setState('done')
    setTimeout(() => onResult({ exerciseType: 'speaking', correct, score: correct ? 1 : 0 }), 700)
  }

  return (
    <Card>
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Say this out loud</p>
      <HebrewText hebrew={item.hebrew} hebrewNikkud={item.hebrewNikkud} transliteration={item.transliteration} />
      <p className="mt-2 text-center text-sm text-slate-400">{item.english}</p>

      {state !== 'unsupported' && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            onClick={record}
            disabled={state === 'listening' || state === 'done'}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl active:scale-95 ${
              state === 'listening' ? 'animate-pulse bg-red-500/20 text-red-400' : 'bg-amber-500/15 text-amber-400'
            }`}
            aria-label="Record"
          >
            🎙️
          </button>
          {state === 'listening' && <p className="text-sm text-slate-400">Listening…</p>}
          {heard && <p className="text-sm text-slate-400">Heard: "{heard}"</p>}
          {graded && (
            <p className={`text-sm ${graded.correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {graded.correct ? 'Nice pronunciation!' : "Not quite — give it another shot next time"}
            </p>
          )}
          {recordError && <p className="text-center text-xs text-amber-500">Couldn't hear that (mic blocked or no speech detected).</p>}
        </div>
      )}
      {state !== 'done' && (
        <div className="mt-5 space-y-2">
          <p className="text-center text-xs text-slate-500">
            {state === 'unsupported'
              ? "Speech recognition isn't available on this device/browser (common on iOS Safari). Say it out loud, then mark honestly:"
              : 'Or skip the mic and mark it yourself:'}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => selfReport(false)}>
              Struggled
            </Button>
            <Button fullWidth onClick={() => selfReport(true)}>
              Said it well
            </Button>
          </div>
        </div>
      )}
      {!settings.speechEnabled && <p className="mt-3 text-center text-xs text-slate-600">Speech is disabled in Settings.</p>}
    </Card>
  )
}
