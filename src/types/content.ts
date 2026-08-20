// Core content types: the curated (and user-added) Hebrew material itself.
// Kept separate from progress/SRS state (see types/progress.ts), which tracks
// how well a given item is known — content is static, progress is per-user.

export type Domain =
  | 'site-safety'
  | 'blueprints-permits'
  | 'subcontractors'
  | 'budgeting-scheduling'
  | 'client-inspector'
  | 'site-talk'
  | 'banking-finance'
  | 'housing'
  | 'bureaucracy'
  | 'daily-life'
  | 'core-grammar'
  | 'personal'

export const DOMAIN_LABELS: Record<Domain, string> = {
  'site-safety': 'Site Safety',
  'blueprints-permits': 'Blueprints & Permits',
  subcontractors: 'Subcontractors & Vendors',
  'budgeting-scheduling': 'Budget & Scheduling',
  'client-inspector': 'Clients & Inspectors',
  'site-talk': 'On-Site Talk',
  'banking-finance': 'Banking & Finance',
  housing: 'Housing & Apartments',
  bureaucracy: 'Bureaucracy & Government',
  'daily-life': 'Daily Life',
  'core-grammar': 'Core Grammar',
  personal: 'My Words',
}

export type Register = 'formal' | 'casual' | 'direct'

export const REGISTER_LABELS: Record<Register, string> = {
  formal: 'Formal (client, inspector, official)',
  casual: 'Casual (colleagues, neighbors)',
  direct: 'Direct site talk (crew, foreman)',
}

export type ItemKind = 'word' | 'phrase' | 'sentence'

export interface VocabItem {
  id: string
  domain: Domain
  register: Register
  kind: ItemKind
  hebrew: string // unvocalized (no nikkud) — the default, real-world form
  hebrewNikkud?: string // vocalized form, shown only if nikkud toggle is on
  transliteration: string
  english: string
  exampleHebrew?: string
  exampleEnglish?: string
  notes?: string // cultural/usage notes (e.g. "direct — don't soften this on site")
  tags?: string[]
  /** Rough difficulty 1 (beginner) - 5 (advanced) used for adaptive selection */
  difficulty: 1 | 2 | 3 | 4 | 5
}

export interface LessonUnit {
  id: string
  domain: Domain
  title: string
  description: string
  itemIds: string[]
  order: number
}

export interface ScenarioTurn {
  id: string
  speaker: 'them' | 'you'
  hebrew: string
  transliteration: string
  english: string
  /** For 'you' turns: acceptable response variants for grading, and next-turn branches */
  acceptableResponses?: string[]
  branches?: { choiceHebrew: string; choiceEnglish: string; nextTurnId: string }[]
}

export interface Scenario {
  id: string
  domain: Domain
  register: Register
  title: string
  setup: string
  turns: ScenarioTurn[]
  startTurnId: string
}
