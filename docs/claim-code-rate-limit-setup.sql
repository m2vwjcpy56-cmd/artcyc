-- =============================================================
-- Brute-Force-Schutz für redeem_athlete_code
-- =============================================================
--
-- Aus Security-Review (M-3): die RPC ist authenticated callable und
-- ohne Rate-Limit. Bei wenigen aktiven 6-Zeichen-Codes wäre Brute-
-- Force theoretisch möglich.
--
-- Schutz:
--   1. Tabelle `claim_code_attempts` trackt fehlgeschlagene Versuche
--      pro auth.uid() mit Timestamp.
--   2. Vor jedem Redeem prüft die Function ob in der letzten Stunde
--      schon ≥10 Fehlversuche stattfanden — wenn ja: hartes Block.
--   3. Bei erfolgreichem Redeem werden alle Attempts vom User gelöscht.
-- =============================================================

create table if not exists public.claim_code_attempts (
  user_id     uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  primary key (user_id, attempted_at)
);

create index if not exists claim_code_attempts_user_idx
  on public.claim_code_attempts(user_id, attempted_at desc);

-- Keine RLS-Policy: die Tabelle wird ausschließlich von der SECURITY
-- DEFINER-Function geschrieben/gelesen. Mit RLS-Enabled aber ohne
-- Policy heißt: niemand kann via REST/SQL drauf zugreifen.
alter table public.claim_code_attempts enable row level security;

-- =============================================================
-- redeem_athlete_code — Version 2 mit Rate-Limit
-- =============================================================
create or replace function public.redeem_athlete_code(input_code text)
returns jsonb as $$
declare
  rec record;
  result jsonb;
  recent_failed_count int;
begin
  if auth.uid() is null then
    raise exception 'Nicht angemeldet';
  end if;

  -- Aufräumen: alle Attempts älter als 1h löschen (Selbst-Cleanup,
  -- damit die Tabelle nicht ewig wächst)
  delete from public.claim_code_attempts
   where attempted_at < now() - interval '1 hour';

  -- Brute-Force-Check: zu viele Fehlversuche in der letzten Stunde
  select count(*) into recent_failed_count
    from public.claim_code_attempts
   where user_id = auth.uid()
     and attempted_at > now() - interval '1 hour';

  if recent_failed_count >= 10 then
    raise exception 'Zu viele falsche Versuche. Warte 1 Stunde und probiere es erneut.';
  end if;

  -- Code normalisieren: Großbuchstaben, Leerzeichen/Bindestriche raus
  input_code := upper(replace(replace(input_code, ' ', ''), '-', ''));

  select * into rec from public.athletes
   where claim_code = input_code
     and claim_code_used_at is null
   limit 1;

  if rec is null then
    -- Fehlversuch loggen, dann Exception
    insert into public.claim_code_attempts(user_id) values (auth.uid());
    raise exception 'Code ungültig oder bereits eingelöst';
  end if;

  -- Verhindern dass User seinen eigenen Code einlöst
  if rec.auth_user_id = auth.uid() or rec.created_by_coach_id = auth.uid() then
    raise exception 'Du kannst deinen eigenen Code nicht einlösen';
  end if;

  if rec.auth_user_id is null then
    -- Richtung 1: Sportler claimt einen Trainer-managed Eintrag
    delete from public.athletes
     where auth_user_id = auth.uid()
       and created_by_coach_id is null
       and id != rec.id;

    update public.athletes
       set auth_user_id = auth.uid(),
           claim_code = null,
           claim_code_used_at = now()
     where id = rec.id;
    result := jsonb_build_object(
      'athlete_id', rec.id,
      'athlete_name', rec.name,
      'role_granted', 'athlete'
    );

  elsif rec.created_by_coach_id is null then
    -- Richtung 2: Trainer wird als Coach hinzugefügt
    if not is_coach() then
      raise exception 'Nur Trainer:innen können Sportler-Zugriff erhalten. Registriere dich als Trainer:in.';
    end if;
    update public.athletes
       set created_by_coach_id = auth.uid(),
           claim_code = null,
           claim_code_used_at = now()
     where id = rec.id;
    result := jsonb_build_object(
      'athlete_id', rec.id,
      'athlete_name', rec.name,
      'role_granted', 'coach'
    );

  else
    raise exception 'Sportler ist bereits mit Account und Trainer verknüpft';
  end if;

  -- Erfolgreicher Redeem: alle Fehlversuche vom User löschen
  delete from public.claim_code_attempts where user_id = auth.uid();

  return result;
end;
$$ language plpgsql volatile security definer;
