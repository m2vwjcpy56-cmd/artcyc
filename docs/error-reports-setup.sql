-- =============================================================
-- Error-Reports-Tabelle für ArtCyc Coach
-- =============================================================
--
-- Sammelt Frontend-Fehler aus window.onerror / unhandledrejection /
-- React-ErrorBoundary / manuellen reportError-Aufrufen. Die
-- report-error Edge Function inserted hier via Service-Role —
-- darum braucht es keine INSERT-Policy. Nur Admins dürfen lesen.
-- =============================================================

create table if not exists public.error_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  user_email   text,
  display_name text,
  message      text not null,
  stack        text,
  source       text,
  url          text,
  user_agent   text,
  app_version  text,
  context      text,
  lang         text,
  fingerprint  text,            -- für Dedup (gleiche Fehler bündeln)
  created_at   timestamptz not null default now()
);

create index if not exists error_reports_created_at_idx  on public.error_reports(created_at desc);
create index if not exists error_reports_user_id_idx     on public.error_reports(user_id);
create index if not exists error_reports_fingerprint_idx on public.error_reports(fingerprint);

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.error_reports enable row level security;

-- SELECT: nur Admins. Inserts laufen via Service-Role und ignorieren
-- RLS, deshalb keine INSERT-Policy nötig.
drop policy if exists "error_reports_select_admin" on public.error_reports;
create policy "error_reports_select_admin"
  on public.error_reports for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Verifizieren:
--   select created_at, user_email, message from public.error_reports
--     order by created_at desc limit 20;
