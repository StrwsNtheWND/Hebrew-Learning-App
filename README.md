# Ivrit Avoda — Hebrew for Work & Life

A personalized Hebrew learning app built for a construction/property-management
professional preparing to move to Israel. It's a phone-first installable web
app (PWA) that works fully offline out of the box, with optional cloud sync
and AI-powered conversation practice you can turn on later.

## What's in here

- **Curriculum**: 127 curated words/phrases across 11 topics — site safety,
  blueprints & permits, subcontractors & vendors, budgeting & scheduling,
  clients & inspectors (formal register), on-site talk (direct register),
  core grammar patterns, banking, housing, government bureaucracy, and daily
  life — plus 4 branching mock-conversation scenarios.
- **Spaced repetition** (SM-2-lite) drives a daily review queue and a 0-100
  mastery score per word.
- **Grading**: multiple-choice, typed (fuzzy-matched Hebrew text), listening,
  and speaking exercises, each scored; lessons get a percentage + letter
  grade; mastery, streaks, and topic-level accuracy are tracked over time.
- **Adaptive difficulty**: rolling accuracy per topic promotes/demotes which
  difficulty band of content you see next.
- **Rewards**: milestones tied to real progress (words mastered, lessons
  completed, streaks, conversations done) — no arbitrary badges.
- **Personal deck**: add your own words/phrases from the job site; they join
  your regular review queue.
- **Nikkud toggle**: off by default (matches real-world unvocalized Hebrew),
  switchable in Settings.
- **Speech**: browser-native text-to-speech and speech recognition (free, no
  API key). Speech recognition is inconsistent on iOS Safari — every speaking
  exercise has a manual "mark it yourself" fallback so you're never stuck.

Everything above works with **zero setup** — clone, install, run. Cloud sync
and AI features are optional layers on top (see below).

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (same Wi-Fi) or in a desktop
browser's device-emulation mode. To install it as an app on your phone, open
it in the phone's browser and use "Add to Home Screen."

To build a production bundle:

```bash
npm run build
npm run preview   # serve the built app locally to sanity-check it
```

## Cloud sync setup (optional)

Without this, your progress is saved locally on-device (IndexedDB) and
persists across sessions, but won't follow you to a second device.

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **SQL Editor → New query**, paste the
   contents of `supabase/schema.sql`, and run it. This creates the
   `user_snapshots` table (and `user_api_keys`, used only if you also enable
   AI features) with row-level security so you can only ever read your own
   data.
3. In **Project Settings → API**, copy the **Project URL** and **anon public
   key**.
4. Create a `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Restart `npm run dev`. In the app's **Settings → Cloud Sync**, sign in
   with your email (passwordless magic link) and use **Back up now** /
   **Restore** to sync progress. This is intentionally a simple
   backup-and-restore model — not real-time multi-device sync — so there's no
   merge-conflict logic to worry about; back up from one device before
   restoring on another.

## AI features setup (optional)

Freeform mock-conversation replies and smarter grading of open-ended
answers, using **your own** Anthropic API key so you control cost directly.
Requires cloud sync (above) to be set up first, since the key is stored
server-side and accessed through a Supabase Edge Function — the Anthropic API
can't be called directly from a browser.

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and log
   in: `supabase login`.
2. Link it to your project: `supabase link --project-ref your-project-ref`
   (find the ref in your Supabase project URL).
3. Deploy the proxy function:
   ```bash
   supabase functions deploy ai-proxy
   ```
4. Add the deployed function's URL to `.env`:
   ```
   VITE_AI_PROXY_URL=https://your-project.supabase.co/functions/v1/ai-proxy
   ```
5. Get an API key from [console.anthropic.com](https://console.anthropic.com)
   (pay-as-you-go; typical cost for 10-15 min/day of practice is a few
   dollars a month). In the app's **Settings → AI Features**, paste it in —
   it's stored in your own Supabase project, protected by row-level security,
   and only ever read server-side by the edge function on your behalf.

Everything else in the app works fully without this — it only unlocks the
freeform conversation continuation and open-ended answer grading.

## Deploying so it's on your phone permanently

Any static host works since this is a plain Vite build. Free options:

- **Cloudflare Pages / Vercel / Netlify**: connect the GitHub repo, set the
  build command to `npm run build` and output directory to `dist`, add the
  same `.env` variables in the host's dashboard, deploy. Then open the URL on
  your phone and "Add to Home Screen."

## Project structure

```
src/
  content/       curated vocab, lessons, and scenario data
  lib/           SRS engine, grading, speech, storage (Dexie), sync, AI proxy client
  state/         React context for user settings
  features/      screens (dashboard, review, lesson, scenarios, stats, deck, settings)
  components/    shared UI primitives
supabase/
  schema.sql             cloud sync tables + RLS policies
  functions/ai-proxy/    edge function proxying AI requests to Anthropic
```

## Extending the curriculum

Vocab lives in `src/content/vocab.construction.ts` and `vocab.life.ts`,
grouped into lesson units in `src/content/lessons.ts`, and scenarios in
`src/content/scenarios.ts`. Each entry is plain TypeScript data — add more
items following the existing shape and they'll automatically show up in
lessons (if added to a `LessonUnit.itemIds` array), the review queue, and
distractor pools.
