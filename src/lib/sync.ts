import { db } from './db'
import { supabase, isCloudConfigured } from './supabaseClient'

export { isCloudConfigured }

export interface Snapshot {
  itemProgress: unknown[]
  attempts: unknown[]
  lessonResults: unknown[]
  personalDeck: unknown[]
  milestones: unknown[]
  dailyStats: unknown[]
  domainSkills: unknown[]
  settings: unknown[]
  exportedAt: number
}

export async function exportSnapshot(): Promise<Snapshot> {
  const [itemProgress, attempts, lessonResults, personalDeck, milestones, dailyStats, domainSkills, settings] =
    await Promise.all([
      db.itemProgress.toArray(),
      db.attempts.toArray(),
      db.lessonResults.toArray(),
      db.personalDeck.toArray(),
      db.milestones.toArray(),
      db.dailyStats.toArray(),
      db.domainSkills.toArray(),
      db.settings.toArray(),
    ])
  return { itemProgress, attempts, lessonResults, personalDeck, milestones, dailyStats, domainSkills, settings, exportedAt: Date.now() }
}

/** Overwrites local tables with the snapshot's contents (used after a cloud pull). */
export async function importSnapshot(snapshot: Snapshot): Promise<void> {
  await db.transaction(
    'rw',
    [db.itemProgress, db.attempts, db.lessonResults, db.personalDeck, db.milestones, db.dailyStats, db.domainSkills, db.settings],
    async () => {
      await Promise.all([
        db.itemProgress.clear(),
        db.attempts.clear(),
        db.lessonResults.clear(),
        db.personalDeck.clear(),
        db.milestones.clear(),
        db.dailyStats.clear(),
        db.domainSkills.clear(),
        db.settings.clear(),
      ])
      type AnyArr = Parameters<typeof db.itemProgress.bulkAdd>[0]
      await Promise.all([
        db.itemProgress.bulkAdd(snapshot.itemProgress as AnyArr),
        db.attempts.bulkAdd(snapshot.attempts as unknown as Parameters<typeof db.attempts.bulkAdd>[0]),
        db.lessonResults.bulkAdd(snapshot.lessonResults as unknown as Parameters<typeof db.lessonResults.bulkAdd>[0]),
        db.personalDeck.bulkAdd(snapshot.personalDeck as unknown as Parameters<typeof db.personalDeck.bulkAdd>[0]),
        db.milestones.bulkAdd(snapshot.milestones as unknown as Parameters<typeof db.milestones.bulkAdd>[0]),
        db.dailyStats.bulkAdd(snapshot.dailyStats as unknown as Parameters<typeof db.dailyStats.bulkAdd>[0]),
        db.domainSkills.bulkAdd(snapshot.domainSkills as unknown as Parameters<typeof db.domainSkills.bulkAdd>[0]),
        db.settings.bulkAdd(snapshot.settings as unknown as Parameters<typeof db.settings.bulkAdd>[0]),
      ])
    },
  )
}

export async function getCurrentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function signInWithEmail(email: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Cloud sync is not configured.' }
  const { error } = await supabase.auth.signInWithOtp({ email })
  return { error: error?.message ?? null }
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

/** Push the local snapshot to the cloud, overwriting whatever is stored there. */
export async function pushToCloud(): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Cloud sync is not configured.' }
  const user = await getCurrentUser()
  if (!user) return { error: 'Not signed in.' }

  const snapshot = await exportSnapshot()
  const { error } = await supabase
    .from('user_snapshots')
    .upsert({ user_id: user.id, data: snapshot, updated_at: new Date().toISOString() })
  return { error: error?.message ?? null }
}

/** Pull the cloud snapshot and overwrite local data with it. */
export async function pullFromCloud(): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Cloud sync is not configured.' }
  const user = await getCurrentUser()
  if (!user) return { error: 'Not signed in.' }

  const { data, error } = await supabase.from('user_snapshots').select('data').eq('user_id', user.id).maybeSingle()
  if (error) return { error: error.message }
  if (!data) return { error: 'No cloud backup found yet — push first.' }

  await importSnapshot(data.data as Snapshot)
  return { error: null }
}
