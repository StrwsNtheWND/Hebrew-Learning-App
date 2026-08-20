// Grading utilities: fuzzy text matching for typed/spoken answers, and
// lesson-level percentage -> letter grade conversion.

/** Normalize Hebrew text for comparison: strip nikkud, punctuation, extra whitespace. */
export function normalizeHebrew(input: string): string {
  return input
    .normalize('NFC')
    .replace(/[֑-ׇ]/g, '') // strip nikkud/cantillation marks
    .replace(/["'׳״.,!?;:\-()]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  let prev = new Array(n + 1)
  let curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

/** 0-1 similarity score, 1 = exact match after normalization. */
export function similarity(input: string, target: string): number {
  const a = normalizeHebrew(input)
  const b = normalizeHebrew(target)
  if (a === b) return 1
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  const dist = levenshtein(a, b)
  return Math.max(0, 1 - dist / maxLen)
}

export interface GradedAnswer {
  correct: boolean
  score: number
  bestMatch: string
}

/** Grade a typed/spoken answer against one or more acceptable target phrases. */
export function gradeAnswer(
  input: string,
  acceptable: string | string[],
  opts: { passThreshold?: number } = {},
): GradedAnswer {
  const targets = Array.isArray(acceptable) ? acceptable : [acceptable]
  const passThreshold = opts.passThreshold ?? 0.82

  let best = { score: 0, target: targets[0] ?? '' }
  for (const target of targets) {
    const score = similarity(input, target)
    if (score > best.score) best = { score, target }
  }

  return {
    correct: best.score >= passThreshold,
    score: best.score,
    bestMatch: best.target,
  }
}

export function percentageToLetterGrade(pct: number): string {
  if (pct >= 97) return 'A+'
  if (pct >= 93) return 'A'
  if (pct >= 90) return 'A-'
  if (pct >= 87) return 'B+'
  if (pct >= 83) return 'B'
  if (pct >= 80) return 'B-'
  if (pct >= 77) return 'C+'
  if (pct >= 73) return 'C'
  if (pct >= 70) return 'C-'
  if (pct >= 60) return 'D'
  return 'F'
}
