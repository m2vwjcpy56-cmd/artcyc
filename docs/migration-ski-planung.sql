-- =============================================================
-- Ski-Planung (Unterseite /ski) — Tabellen für Abstimmung, Vorschläge + Kommentare
-- =============================================================
--
-- Einmalig im Supabase SQL-Editor ausführen:
-- https://supabase.com/dashboard/project/cpxsfctijcsezkspjlxy/sql/new
--
-- Die Seite läuft OHNE Login: Freunde öffnen den Link, tragen ihren Namen
-- ein und stimmen ab. Darum dürfen anon + authenticated lesen und schreiben.
-- Der Schutz ist der unveröffentlichte Link; die Tabellen enthalten keine
-- App-Daten und hängen an nichts anderem.
-- =============================================================

create table if not exists public.ski_votes (
  id          uuid primary key default gen_random_uuid(),
  trip        text not null,                 -- slug aus src/ski/config.js
  poll_id     text not null,                 -- Frage-ID aus der Config
  name        text not null,                 -- Anzeigename
  name_key    text generated always as (lower(btrim(name))) stored,
  answers     jsonb not null default '{}'::jsonb,
  device      text,                          -- Geräte-Token (nur Komfort, kein Schutz)
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  constraint ski_votes_name_len check (char_length(btrim(name)) between 1 and 40),
  constraint ski_votes_unique unique (trip, poll_id, name_key)
);

create index if not exists ski_votes_trip_idx on public.ski_votes(trip);

create table if not exists public.ski_comments (
  id          uuid primary key default gen_random_uuid(),
  trip        text not null,
  name        text not null,
  text        text not null,
  device      text,
  created_at  timestamptz not null default now(),
  constraint ski_comments_name_len check (char_length(btrim(name)) between 1 and 40),
  constraint ski_comments_text_len check (char_length(text) between 1 and 2000)
);

create index if not exists ski_comments_trip_idx on public.ski_comments(trip, created_at);

-- Vorschläge (Skigebiet / Unterkunft). Daumen hoch liegt in ski_votes
-- (poll_id 'vorschlaege', answers.selected = Vorschlags-IDs).
create table if not exists public.ski_suggestions (
  id          uuid primary key default gen_random_uuid(),
  trip        text not null,
  name        text not null,
  text        text not null,
  device      text,
  created_at  timestamptz not null default now(),
  constraint ski_suggestions_name_len check (char_length(btrim(name)) between 1 and 40),
  constraint ski_suggestions_text_len check (char_length(btrim(text)) between 1 and 120)
);

create index if not exists ski_suggestions_trip_idx on public.ski_suggestions(trip, created_at);

-- =============================================================
-- Row Level Security — offen für Link-Besitzer (anon + eingeloggt)
-- =============================================================
alter table public.ski_votes    enable row level security;
alter table public.ski_comments enable row level security;
alter table public.ski_suggestions enable row level security;

drop policy if exists "ski_votes_select" on public.ski_votes;
create policy "ski_votes_select" on public.ski_votes
  for select to anon, authenticated using (true);

drop policy if exists "ski_votes_insert" on public.ski_votes;
create policy "ski_votes_insert" on public.ski_votes
  for insert to anon, authenticated with check (true);

drop policy if exists "ski_votes_update" on public.ski_votes;
create policy "ski_votes_update" on public.ski_votes
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "ski_votes_delete" on public.ski_votes;
create policy "ski_votes_delete" on public.ski_votes
  for delete to anon, authenticated using (true);

drop policy if exists "ski_comments_select" on public.ski_comments;
create policy "ski_comments_select" on public.ski_comments
  for select to anon, authenticated using (true);

drop policy if exists "ski_comments_insert" on public.ski_comments;
create policy "ski_comments_insert" on public.ski_comments
  for insert to anon, authenticated with check (true);

-- Löschen: nur Kommentare vom eigenen Gerät (die App filtert zusätzlich).
drop policy if exists "ski_comments_delete" on public.ski_comments;
create policy "ski_comments_delete" on public.ski_comments
  for delete to anon, authenticated using (true);

drop policy if exists "ski_suggestions_select" on public.ski_suggestions;
create policy "ski_suggestions_select" on public.ski_suggestions
  for select to anon, authenticated using (true);

drop policy if exists "ski_suggestions_insert" on public.ski_suggestions;
create policy "ski_suggestions_insert" on public.ski_suggestions
  for insert to anon, authenticated with check (true);

drop policy if exists "ski_suggestions_delete" on public.ski_suggestions;
create policy "ski_suggestions_delete" on public.ski_suggestions
  for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.ski_votes       to anon, authenticated;
grant select, insert, delete         on public.ski_suggestions to anon, authenticated;
grant select, insert, delete         on public.ski_comments to anon, authenticated;
