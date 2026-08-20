import { supabase, isCloudConfigured } from './supabaseClient'

const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL as string | undefined

export function isAiConfigured(): boolean {
  return isCloudConfigured() && Boolean(PROXY_URL)
}

export async function saveAnthropicApiKey(apiKey: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Cloud sync must be configured before AI features can be enabled.' }
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Sign in first (Settings -> Cloud Sync).' }

  const { error } = await supabase
    .from('user_api_keys')
    .upsert({ user_id: userData.user.id, anthropic_api_key: apiKey, updated_at: new Date().toISOString() })
  return { error: error?.message ?? null }
}

export async function clearAnthropicApiKey(): Promise<void> {
  if (!supabase) return
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return
  await supabase.from('user_api_keys').delete().eq('user_id', userData.user.id)
}

interface ProxyMessage {
  role: 'user' | 'assistant'
  content: string
}

async function callProxy(system: string, messages: ProxyMessage[], maxTokens = 300): Promise<string> {
  if (!supabase || !PROXY_URL) throw new Error('AI features are not configured.')
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (!token) throw new Error('Sign in first (Settings -> Cloud Sync).')

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ system, messages, maxTokens }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? `AI request failed (${res.status})`)

  const text = json.content?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected AI response shape.')
  return text
}

/**
 * Freeform conversation partner for a scenario, once the learner has
 * finished the scripted branches and wants open-ended practice. Replies in
 * Hebrew with a matching English gloss on the line below, so the UI can
 * split and show both.
 */
export async function getFreeformReply(
  scenarioTitle: string,
  register: string,
  history: ProxyMessage[],
): Promise<string> {
  const system = `You are role-playing as the other party in a Hebrew workplace/life scenario titled "${scenarioTitle}", speaking in a ${register} register. The learner is a construction/property-management professional preparing to move to Israel. Reply ONLY in unvocalized Hebrew (no nikkud) with one short, natural line (max ~20 words), then on a new line give the English translation prefixed with "EN: ". Do not break character or add commentary.`
  const reply = await callProxy(system, history, 200)
  return reply
}

export interface FreeformGrade {
  correct: boolean
  feedback: string
}

/** Grades an open-ended typed/spoken answer where exact fuzzy matching isn't enough. */
export async function gradeFreeformAnswer(
  promptEnglish: string,
  expectedIdeaEnglish: string,
  learnerAnswerHebrew: string,
): Promise<FreeformGrade> {
  const system = `You are a strict but encouraging Hebrew tutor for a construction/property-management professional. Given the task, the idea the answer should convey, and the learner's Hebrew answer, respond with EXACTLY two lines: line 1 is "CORRECT" or "INCORRECT"; line 2 is one short sentence of feedback in English (grammar/word-choice notes, said plainly, no fluff).`
  const userMsg = `Task: ${promptEnglish}\nExpected idea: ${expectedIdeaEnglish}\nLearner's Hebrew answer: ${learnerAnswerHebrew}`
  const reply = await callProxy(system, [{ role: 'user', content: userMsg }], 150)
  const [verdictLine, ...rest] = reply.trim().split('\n')
  return { correct: verdictLine.trim().toUpperCase().startsWith('CORRECT'), feedback: rest.join(' ').trim() }
}
