import Dexie, { type Table } from 'dexie'
import type {
  ItemProgress,
  AttemptRecord,
  LessonResult,
  PersonalDeckItem,
  MilestoneRecord,
  DailyStat,
  DomainSkill,
  UserSettings,
} from '../types/progress'

/**
 * Local-first store. The app is fully functional offline against this
 * IndexedDB database; lib/sync.ts optionally mirrors it to Supabase when the
 * user configures a project (see README "Cloud sync setup").
 */
class HebrewAppDB extends Dexie {
  itemProgress!: Table<ItemProgress, string>
  attempts!: Table<AttemptRecord, string>
  lessonResults!: Table<LessonResult, string>
  personalDeck!: Table<PersonalDeckItem, string>
  milestones!: Table<MilestoneRecord, string>
  dailyStats!: Table<DailyStat, string>
  domainSkills!: Table<DomainSkill, string>
  settings!: Table<{ key: string; value: unknown }, string>

  constructor() {
    super('hebrew-learning-app')
    this.version(1).stores({
      itemProgress: 'itemId, dueAt, mastery',
      attempts: 'id, itemId, exerciseType, answeredAt, domain',
      lessonResults: 'id, lessonId, finishedAt, domain',
      personalDeck: 'id, domain, createdAt',
      milestones: 'id, milestoneId, achievedAt',
      dailyStats: 'date',
      domainSkills: 'domain',
      settings: 'key',
    })
  }
}

export const db = new HebrewAppDB()

const SETTINGS_KEY = 'user-settings'

export async function loadSettings(defaults: UserSettings): Promise<UserSettings> {
  const row = await db.settings.get(SETTINGS_KEY)
  if (!row) return defaults
  return { ...defaults, ...(row.value as Partial<UserSettings>) }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await db.settings.put({ key: SETTINGS_KEY, value: settings })
}

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}
