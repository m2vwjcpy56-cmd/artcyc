-- =============================================================
-- UCI-Reglement: mehrsprachige Übungs-Datenbank + Versions-Tracking
-- =============================================================
--
-- Drei Tabellen:
--   1. `uci_exercises`         — Übungs-Stammdaten pro Sprache
--   2. `uci_rules_versions`    — Tracking der PDF-Quellen (Versions-Hashes)
--   3. `app_notices`           — In-App-Banner (z. B. „Neues Reglement")
--
-- Befüllung: einmalig per SQL-Seed (DE-Namen aus UCI_DB_2026) — danach
-- vollautomatisch über die uci-rules-check Edge Function bzw. GitHub
-- Action. EN/FR-Namen werden später aus den Reglement-PDFs nachgepflegt.
-- =============================================================

-- =============================================================
-- 1. UCI-Übungen (mehrsprachig)
-- =============================================================
create table if not exists public.uci_exercises (
  code        text not null,                -- z. B. '1001a'
  discipline  text not null,                -- '1er' | '2er' | '4er' | '6er'
  points      numeric not null,
  name_de     text,
  name_en     text,
  name_fr     text,
  version     text not null default '2026', -- Reglement-Jahr
  updated_at  timestamptz not null default now(),
  primary key (code, version)
);

create index if not exists uci_exercises_disc_idx    on public.uci_exercises(discipline);
create index if not exists uci_exercises_version_idx on public.uci_exercises(version);

-- RLS: Lesen für alle eingeloggten User (App-globale Stammdaten).
-- Schreiben nur via Service-Role (Edge Function / GitHub Action).
alter table public.uci_exercises enable row level security;

drop policy if exists "uci_exercises_select_authenticated" on public.uci_exercises;
create policy "uci_exercises_select_authenticated"
  on public.uci_exercises for select
  to authenticated
  using (true);

-- =============================================================
-- 2. Versions-Tracking der PDF-Quellen
-- =============================================================
create table if not exists public.uci_rules_versions (
  lang             text primary key,        -- 'de' | 'en' | 'fr'
  pdf_url          text not null,
  last_modified    text,                    -- HTTP Last-Modified-Header
  etag             text,                    -- HTTP ETag falls vorhanden
  content_hash     text,                    -- SHA-256 des PDF-Inhalts
  last_checked_at  timestamptz,
  last_changed_at  timestamptz,             -- wann sich der Hash geändert hat
  current_version  text default '2026',
  exercise_count   int,
  notes            text                     -- vom Sync-Job geschriebene Notizen
);

alter table public.uci_rules_versions enable row level security;

drop policy if exists "uci_rules_versions_select_authenticated" on public.uci_rules_versions;
create policy "uci_rules_versions_select_authenticated"
  on public.uci_rules_versions for select
  to authenticated
  using (true);

-- Initialer Seed der drei zu überwachenden Quellen
insert into public.uci_rules_versions (lang, pdf_url)
values
  ('en', 'https://archive.uci.org/docs/default-source/rules-and-regulations/part-viii--indoor-cycling---artistic-cycling.pdf'),
  ('de', 'https://kunstradreglement.com/images/PDF/datenfiles_kufa/2026/UCI-Reglement%20Kunstrad%202026%20deutsch.pdf'),
  ('fr', 'https://kunstradreglement.com/images/PDF/datenfiles_kufa/2026/UCI-Reglement%20Kunstrad%202026%20francais.pdf')
on conflict (lang) do nothing;

-- =============================================================
-- 3. App-Notices (In-App-Banner für Reglement-Updates etc.)
-- =============================================================
create table if not exists public.app_notices (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,                -- z. B. 'uci_rules_updated_2026_v2'
  category    text not null default 'info' check (category in ('info','warning','update')),
  title       text not null,
  body        text,
  link_url    text,
  link_label  text,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz,
  active      boolean not null default true
);

create index if not exists app_notices_active_idx on public.app_notices(active, created_at desc);
create unique index if not exists app_notices_key_idx on public.app_notices(key);

alter table public.app_notices enable row level security;

drop policy if exists "app_notices_select_authenticated" on public.app_notices;
create policy "app_notices_select_authenticated"
  on public.app_notices for select
  to authenticated
  using (active = true and (expires_at is null or expires_at > now()));

-- Pro User wird gespeichert, welche Notices schon weggeklickt wurden
create table if not exists public.app_notices_dismissed (
  user_id      uuid not null references auth.users(id) on delete cascade,
  notice_id    uuid not null references public.app_notices(id) on delete cascade,
  dismissed_at timestamptz not null default now(),
  primary key (user_id, notice_id)
);

alter table public.app_notices_dismissed enable row level security;

drop policy if exists "notices_dismissed_select_own" on public.app_notices_dismissed;
create policy "notices_dismissed_select_own"
  on public.app_notices_dismissed for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "notices_dismissed_insert_own" on public.app_notices_dismissed;
create policy "notices_dismissed_insert_own"
  on public.app_notices_dismissed for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Verifizieren:
--   select code, discipline, points, name_de from public.uci_exercises order by code limit 10;
--   select * from public.uci_rules_versions;
--   select * from public.app_notices where active;
