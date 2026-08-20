import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Null when the app hasn't been given Supabase credentials — the app must
 * work fully offline/local without them. See README "Cloud sync setup" for
 * how to create a free Supabase project and populate .env.
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

export function isCloudConfigured(): boolean {
  return supabase !== null
}
