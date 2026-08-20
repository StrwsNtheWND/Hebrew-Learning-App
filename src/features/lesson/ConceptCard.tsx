import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { speakHebrew, speechSynthesisSupported } from '../../lib/speech'
import type { GrammarConcept } from '../../types/content'

/**
 * Explains a grammar pattern (currently: a binyan) before the learner
 * drills example verbs in it — the pattern has to be taught before
 * examples of it can be reasonably quizzed.
 */
export function ConceptCard({ concept, onContinue }: { concept: GrammarConcept; onContinue: () => void }) {
  return (
    <Card>
      <p className="mb-1 text-center text-xs uppercase tracking-wide text-amber-500/80">Verb pattern</p>
      <div className="flex items-center justify-center gap-2" dir="rtl">
        <span className="font-hebrew text-3xl text-slate-50">{concept.hebrewName}</span>
        {speechSynthesisSupported() && (
          <button
            type="button"
            onClick={() => speakHebrew(concept.hebrewName)}
            className="text-slate-400 hover:text-amber-400"
            aria-label="Play pronunciation"
          >
            🔊
          </button>
        )}
      </div>
      <p className="mt-1 text-center text-base font-semibold text-slate-100">{concept.title}</p>
      <p className="mt-1 text-center text-sm text-slate-400">{concept.meaning}</p>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">{concept.explanation}</p>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">
          Root {concept.exampleRoot} — {concept.exampleInfinitive.english}
        </p>
        <p className="font-hebrew mt-1 text-right text-xl text-slate-50" dir="rtl">
          {concept.exampleInfinitive.hebrew}
        </p>
        <p className="text-right text-xs text-slate-500">{concept.exampleInfinitive.transliteration}</p>

        <div className="mt-3 space-y-1.5 border-t border-slate-800 pt-3">
          {concept.presentTense.map((row) => (
            <div key={row.person} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{row.person}</span>
              <span className="text-right">
                <span className="font-hebrew text-slate-100" dir="rtl">
                  {row.hebrew}
                </span>
                <span className="ml-2 text-xs text-slate-500">{row.transliteration}</span>
              </span>
            </div>
          ))}
        </div>

        {concept.pastExample && (
          <div className="mt-3 border-t border-slate-800 pt-3 text-sm">
            <span className="text-slate-500">Past, I: </span>
            <span className="font-hebrew text-slate-100" dir="rtl">
              {concept.pastExample.hebrew}
            </span>
            <span className="ml-2 text-xs text-slate-500">
              {concept.pastExample.transliteration} — {concept.pastExample.english}
            </span>
          </div>
        )}
      </div>

      <Button className="mt-5" fullWidth onClick={onContinue}>
        Practice this pattern
      </Button>
    </Card>
  )
}
