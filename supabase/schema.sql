-- Run this in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query)
-- after creating a free project at https://supabase.com. See README "Cloud sync setup".

-- One row per user holding a full JSON snapshot of their local progress DB.
-- This is a deliberately simple "backup and restore" sync model rather than
-- a fully relational one: it's easy to reason about for a single-user app
-- and avoids merge-conflict logic across devices.
create table if not exists public.user_snapshots (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_snapshots enable row level security;

create policy "Users can read their own snapshot"
  on public.user_snapshots for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own snapshot"
  on public.user_snapshots for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own snapshot"
  on public.user_snapshots for update
  using (auth.uid() = user_id);

-- Optional: stores the user's Anthropic API key server-side, encrypted at
-- rest by Supabase, so the ai-proxy edge function can use it without the
-- key ever living in browser storage. Only needed if you enable AI features
-- (see supabase/functions/ai-proxy and README "AI features setup").
create table if not exists public.user_api_keys (
  user_id uuid primary key references auth.users (id) on delete cascade,
  anthropic_api_key text not null,
  updated_at timestamptz not null default now()
);

alter table public.user_api_keys enable row level security;

create policy "Users can manage their own API key"
  on public.user_api_keys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
