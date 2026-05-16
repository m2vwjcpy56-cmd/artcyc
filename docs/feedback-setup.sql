-- =============================================================
-- Feedback-Tabelle für ArtCyc Coach
-- =============================================================
--
-- Diese Datei einmalig im Supabase SQL-Editor ausführen:
-- https://supabase.com/dashboard/project/cpxsfctijcsezkspjlxy/sql/new
--
-- Erstellt:
--   1. Tabelle `feedback`
--   2. RLS-Policies (User kann eigenes Feedback einreichen, Admin
--      sieht alles)
--   3. Indices für sinnvolle Such-Performance
-- =============================================================

create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  user_email  text,            -- für anonymes Feedback redundant gespeichert
  display_name text,           -- falls vorhanden
  text        text not null,
  category    text not null default 'other'
                check (category in ('bug', 'idea', 'question', 'other')),
  source      text not null default 'user'
                check (source in ('user', 'ai')),
  app_version text,
  user_agent  text,
  url         text,
  created_at  timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback(created_at desc);
create index if not exists feedback_user_id_idx    on public.feedback(user_id);
create index if not exists feedback_category_idx   on public.feedback(category);

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.feedback enable row level security;

-- INSERT: jeder eingeloggte User darf eigenes Feedback eintragen.
-- user_id MUSS dem eigenen Auth-Subject entsprechen — verhindert
-- dass jemand Feedback unter fremder ID einreicht.
drop policy if exists "feedback_insert_own" on public.feedback;
create policy "feedback_insert_own"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

-- SELECT: nur Admins sehen alles. Admins sind in der profiles-Tabelle
-- mit role = 'admin' markiert.
drop policy if exists "feedback_select_admin" on public.feedback;
create policy "feedback_select_admin"
  on public.feedback for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================
-- (Optional) Eigene Feedback-Einträge auch dem User selbst zeigen
-- — z. B. damit die App ihm seine eigene History anzeigen kann.
-- =============================================================
drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own"
  on public.feedback for select
  to authenticated
  using (auth.uid() = user_id);

-- =============================================================
-- (Optional) Slack/Mail-Webhook via pg_net oder Edge-Function-Trigger
-- — wird über die separate submit-feedback Edge Function abgedeckt
-- (sendet Resend-Mail an FEEDBACK_EMAIL).
-- =============================================================

-- Verifizieren:
--   select * from public.feedback order by created_at desc limit 10;
