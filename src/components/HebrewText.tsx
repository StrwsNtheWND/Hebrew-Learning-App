import { useSettings } from '../state/SettingsContext'
import { speakHebrew, speechSynthesisSupported } from '../lib/speech'

export function HebrewText({
  hebrew,
  hebrewNikkud,
  transliteration,
  className = '',
  size = 'lg',
  speakable = true,
}: {
  hebrew: string
  hebrewNikkud?: string
  transliteration?: string
  className?: string
  size?: 'md' | 'lg' | 'xl'
  speakable?: boolean
}) {
  const { settings } = useSettings()
  const display = settings.showNikkud && hebrewNikkud ? hebrewNikkud : hebrew
  const sizeClass = size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-2" dir="rtl">
        <span className={`font-hebrew ${sizeClass} text-slate-50`}>{display}</span>
        {speakable && speechSynthesisSupported() && (
          <button
            type="button"
            onClick={() => speakHebrew(hebrew)}
            className="text-slate-400 hover:text-amber-400"
            aria-label="Play pronunciation"
          >
            🔊
          </button>
        )}
      </div>
      {transliteration && <p className="mt-1 text-center text-sm text-slate-400">{transliteration}</p>}
    </div>
  )
}
