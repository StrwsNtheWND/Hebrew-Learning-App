import type { Domain } from './content'

/** Per-item spaced-repetition state (SM-2 lite). */
export interface ItemProgress {
  itemId: string
  /** 0-100 mastery estimate, derived from SRS state, shown to the user as "strength" */
  mastery: number
  easeFactor: number // SM-2 ease factor, starts at 2.5
  intervalDays: number
  repetitions: number
  dueAt: number // epoch ms
  lastReviewedAt: number | null
  lapses: number // times forgotten after being learned
  createdAt: number
}

export type ExerciseType = 'multiple-choice' | 'typed' | 'listening' | 'speaking' | 'scenario'

export interface AttemptRecord {
  id: string
  itemId: string
  exerciseType: ExerciseType
  correct: boolean
  /** 0-1 partial-credit score (fuzzy match strength, speech confidence, etc.) */
  score: number
  answeredAt: number
  domain: Domain
}

export interface LessonResult {
  id: string
  lessonId: string
  domain: Domain
  startedAt: number
  finishedAt: number
  totalItems: number
  correctItems: number
  percentage: number
  letterGrade: string
}

export interface PersonalDeckItem {
  id: string
  hebrew: string
  transliteration: string
  english: string
  notes?: string
  domain: Domain
  createdAt: number
}

export interface MilestoneRecord {
  id: string
  milestoneId: string
  achievedAt: number
  label: string
  detail: string
}

export interface DailyStat {
  date: string // YYYY-MM-DD
  itemsReviewed: number
  correctCount: number
  minutesActive: number
  newWordsLearned: number
}

export type DifficultyBand = 'foundation' | 'standard' | 'stretch'

export interface DomainSkill {
  domain: Domain
  /** rolling accuracy over the last N attempts, 0-1 */
  rollingAccuracy: number
  attemptsConsidered: number
  currentBand: DifficultyBand
  updatedAt: number
}

export interface UserSettings {
  showNikkud: boolean
  dailyGoalMinutes: number
  speechEnabled: boolean
  aiFeaturesEnabled: boolean
  anthropicApiKeyStored: boolean // whether a key exists (never store/display the raw key here)
  supabaseSyncEnabled: boolean
  onboardingComplete: boolean
  displayName: string
  moveDate: string // ISO date, e.g. target move to Israel
}

export const DEFAULT_SETTINGS: UserSettings = {
  showNikkud: false,
  dailyGoalMinutes: 15,
  speechEnabled: true,
  aiFeaturesEnabled: false,
  anthropicApiKeyStored: false,
  supabaseSyncEnabled: false,
  onboardingComplete: false,
  displayName: '',
  moveDate: '',
}
