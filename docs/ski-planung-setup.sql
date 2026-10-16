-- =============================================================
-- Ski-Planung (Unterseite /ski) — Tabellen für Abstimmung + Vorschläge
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

-- =============================================================
-- E-Mail-Adressen (privat) — aktuell ungenutzt, die Frage wurde wieder
-- aus dem Fragebogen genommen. Tabelle/Funktion bleiben bestehen.
-- Kein Lesezugriff für anon/authenticated —
-- einsehbar nur im Supabase-Dashboard. Schreiben ausschließlich über die
-- Funktion ski_save_contact (security definer), damit niemand fremde
-- Adressen auslesen kann.
-- =============================================================
create table if not exists public.ski_contacts (
  id          uuid primary key default gen_random_uuid(),
  trip        text not null,
  name        text not null,
  name_key    text generated always as (lower(btrim(name))) stored,
  email       text not null,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  constraint ski_contacts_unique unique (trip, name_key)
);

alter table public.ski_contacts enable row level security;
revoke all on public.ski_contacts from anon, authenticated;

create or replace function public.ski_save_contact(p_trip text, p_name text, p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_trip is null or char_length(btrim(p_trip)) not between 1 and 40 then
    raise exception 'ungueltiger Trip';
  end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 40 then
    raise exception 'ungueltiger Name';
  end if;
  if p_email is null or char_length(btrim(p_email)) > 200
     or btrim(p_email) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' then
    raise exception 'ungueltige E-Mail-Adresse';
  end if;
  insert into public.ski_contacts (trip, name, email)
  values (btrim(p_trip), btrim(p_name), lower(btrim(p_email)))
  on conflict (trip, name_key)
  do update set email = excluded.email, name = excluded.name, updated_at = now();
end;
$$;

revoke all on function public.ski_save_contact(text, text, text) from public;
grant execute on function public.ski_save_contact(text, text, text) to anon, authenticated;

-- PostgREST (die REST-Schnittstelle) soll die neuen Tabellen sofort kennen —
-- sonst meldet die Seite „Could not find the table … in the schema cache".
notify pgrst, 'reload schema';
