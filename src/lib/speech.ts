// Thin wrapper around the browser's built-in Web Speech API.
// TTS (speechSynthesis) is broadly supported. STT (SpeechRecognition) is
// solid on Android Chrome, inconsistent/absent on iOS Safari — every
// consumer must handle `speechRecognitionSupported() === false` gracefully.

export function speechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let cachedHebrewVoice: SpeechSynthesisVoice | null | undefined

function pickHebrewVoice(): SpeechSynthesisVoice | null {
  if (cachedHebrewVoice !== undefined) return cachedHebrewVoice
  const voices = window.speechSynthesis.getVoices()
  cachedHebrewVoice = voices.find((v) => v.lang.toLowerCase().startsWith('he')) ?? null
  return cachedHebrewVoice
}

// Some browsers load voices asynchronously; refresh the cache once they arrive.
if (speechSynthesisSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedHebrewVoice = undefined
  }
}

export function speakHebrew(text: string, opts: { rate?: number } = {}): void {
  if (!speechSynthesisSupported()) return
  window.speechSynthesis.cancel() // avoid overlapping utterances
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'he-IL'
  utterance.rate = opts.rate ?? 0.9
  const voice = pickHebrewVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

// --- Speech recognition (STT) ---

type SpeechRecognitionCtor = new () => SpeechRecognition

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function speechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null
}

export interface RecognitionResult {
  transcript: string
  confidence: number
}

/** Listens once and resolves with the best transcript, or rejects on error/timeout. */
export function listenOnce(opts: { timeoutMs?: number } = {}): Promise<RecognitionResult> {
  const Ctor = getRecognitionCtor()
  if (!Ctor) return Promise.reject(new Error('speech-recognition-unsupported'))

  return new Promise((resolve, reject) => {
    const recognition = new Ctor()
    recognition.lang = 'he-IL'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    const timeout = setTimeout(() => {
      recognition.stop()
      reject(new Error('speech-recognition-timeout'))
    }, opts.timeoutMs ?? 8000)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      clearTimeout(timeout)
      const result = event.results[0]?.[0]
      if (result) resolve({ transcript: result.transcript, confidence: result.confidence })
      else reject(new Error('speech-recognition-empty'))
    }
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      clearTimeout(timeout)
      reject(new Error(`speech-recognition-error:${event.error}`))
    }
    recognition.onend = () => clearTimeout(timeout)

    recognition.start()
  })
}
