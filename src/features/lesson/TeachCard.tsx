import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { HebrewText } from '../../components/HebrewText'
import type { VocabItem } from '../../types/content'
import { REGISTER_LABELS } from '../../types/content'

/**
 * Shown once, the first time a word/phrase appears, before any graded
 * exercise. Plain introduction — no scoring, no pressure — so the quiz that
 * follows tests something the learner actually saw first.
 */
export function TeachCard({ item, onContinue }: { item: VocabItem; onContinue: () => void }) {
  return (
    <Card>
      <p className="mb-1 text-center text-xs uppercase tracking-wide text-amber-500/80">New word</p>
      <HebrewText hebrew={item.hebrew} hebrewNikkud={item.hebrewNikkud} transliteration={item.transliteration} size="xl" />
      <p className="mt-3 text-center text-lg text-slate-100">{item.english}</p>

      {item.exampleHebrew && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="font-hebrew text-right text-base text-slate-200" dir="rtl">
            {item.exampleHebrew}
          </p>
          {item.exampleEnglish && <p className="mt-1 text-right text-xs text-slate-500">{item.exampleEnglish}</p>}
        </div>
      )}

      {item.notes && (
        <div className="mt-3 rounded-xl bg-amber-500/5 p-3">
          <p className="text-xs text-amber-300/90">{item.notes}</p>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-slate-600">{REGISTER_LABELS[item.register]}</p>

      <Button className="mt-5" fullWidth onClick={onContinue}>
        Got it — quiz me
      </Button>
    </Card>
  )
}
