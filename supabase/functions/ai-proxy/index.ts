// Supabase Edge Function: proxies AI requests (mock-conversation replies,
// freeform-answer grading) to the Anthropic API using the calling user's own
// stored API key, so the key never has to live in the browser or be sent
// from client JS directly to Anthropic (which the browser can't do anyway —
// the Anthropic API doesn't allow cross-origin requests from a page).
//
// Deploy with the Supabase CLI (see README "AI features setup"):
//   supabase functions deploy ai-proxy
//
// This function expects the caller's Supabase auth JWT in the Authorization
// header (the supabase-js client sends this automatically) and reads the
// user's Anthropic key from the `user_api_keys` table, which is protected by
// row-level security so a user can only ever read their own key.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const MODEL = 'claude-haiku-4-5-20251001' // cheap + fast, appropriate for short practice turns

interface ProxyRequestBody {
  system: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  maxTokens?: number
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: corsHeaders })
    }

    const { data: keyRow, error: keyError } = await supabase
      .from('user_api_keys')
      .select('anthropic_api_key')
      .eq('user_id', userData.user.id)
      .maybeSingle()

    if (keyError || !keyRow) {
      return new Response(
        JSON.stringify({ error: 'No Anthropic API key on file. Add one in Settings to enable AI features.' }),
        { status: 400, headers: corsHeaders },
      )
    }

    const body = (await req.json()) as ProxyRequestBody

    const anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': keyRow.anthropic_api_key,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: body.maxTokens ?? 300,
        system: body.system,
        messages: body.messages,
      }),
    })

    const result = await anthropicRes.json()
    return new Response(JSON.stringify(result), {
      status: anthropicRes.status,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders })
  }
})
