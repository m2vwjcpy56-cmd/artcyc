-- =====================================================
-- Migration Phase 13 — Claim-Code robust + selbstheilend
-- =====================================================
-- In Supabase → SQL Editor ausführen. Idempotent, mehrfach gefahrlos.
--
-- HINTERGRUND (Bug):
--   Marius bekam bei einem FRISCH generierten Code "Code ungültig oder
--   bereits eingelöst". Ursache: in der Produktion lief noch die alte
--   `redeem_athlete_code` (Phase 9b), die den Code NUR in `athletes`
--   sucht. Die moderne "Trainer einladen"-Funktion legt Codes aber in
--   `coach_invites` ab → der frische Code wurde dort nie gefunden.
--
-- WAS DIESE MIGRATION TUT:
--   (1) Stellt die Rate-Limit-Tabelle sicher (sonst bricht die Funktion ab).
--   (2) Deployt die KORREKTE, vereinheitlichte `redeem_athlete_code`:
--       sucht erst in coach_invites, dann in athletes; behandelt alle
--       Richtungen (Sportler claimt sich / Trainer per Code dazu); KEINE
--       "nur Trainer"-Sperre; mit Brute-Force-Schutz.
--   (3) Schaltet die stille 24-h-Auto-Rotation AB: weitergegebene Codes
--       bleiben gültig, bis sie eingelöst oder manuell widerrufen werden
--       ("funktioniert auch, wenn nicht mehr frisch"). Brute-Force-Schutz
--       übernimmt weiterhin das Rate-Limit (max. 10 Fehlversuche/Stunde).
-- =====================================================

-- ---------- (1) Rate-Limit-Tabelle sicherstellen ----------
create table if not exists public.claim_code_attempts (
  user_id      uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  primary key (user_id, attempted_at)
);
create index if not exists claim_code_attempts_user_idx
  on public.claim_code_attempts(user_id, attempted_at desc);
alter table public.claim_code_attempts enable row level security;

-- ---------- (2) Vereinheitlichte, korrekte Einlöse-Funktion ----------
CREATE OR REPLACE FUNCTION public.redeem_athlete_code(input_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  rec record; inv record;
  inv_found BOOLEAN; rec_found BOOLEAN;
  result JSONB; recent_failed_count INT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Nicht angemeldet'; END IF;

  -- Brute-Force-Schutz: alte Versuche aufräumen + Limit prüfen
  DELETE FROM public.claim_code_attempts WHERE attempted_at < now() - interval '1 hour';
  SELECT count(*) INTO recent_failed_count
    FROM public.claim_code_attempts
   WHERE user_id = auth.uid()
     AND attempted_at > now() - interval '1 hour';
  IF recent_failed_count >= 10 THEN
    RAISE EXCEPTION 'Zu viele falsche Versuche. Warte 1 Stunde und probiere es erneut.';
  END IF;

  -- Code normalisieren (Großschrift, ohne Leer-/Bindestriche)
  input_code := upper(replace(replace(input_code, ' ', ''), '-', ''));

  -- A) Zuerst: moderner Trainer-Einladungs-Code (coach_invites)
  SELECT ci.*, a.name AS athlete_name, a.auth_user_id AS athlete_user
    INTO inv
    FROM coach_invites ci
    JOIN athletes a ON a.id = ci.athlete_id
   WHERE ci.claim_code = input_code AND ci.used_at IS NULL
   LIMIT 1;
  inv_found := FOUND;
  IF inv_found THEN
    IF inv.athlete_user = auth.uid() THEN
      RAISE EXCEPTION 'Du kannst deinen eigenen Code nicht einlösen';
    END IF;
    INSERT INTO athlete_coaches (athlete_id, coach_id)
    VALUES (inv.athlete_id, auth.uid()) ON CONFLICT DO NOTHING;
    UPDATE coach_invites
       SET used_at = now(), used_by_coach_id = auth.uid(), claim_code = NULL
     WHERE id = inv.id;
    UPDATE athletes
       SET created_by_coach_id = COALESCE(created_by_coach_id, auth.uid())
     WHERE id = inv.athlete_id;
    DELETE FROM public.claim_code_attempts WHERE user_id = auth.uid();
    RETURN jsonb_build_object(
      'athlete_id', inv.athlete_id, 'athlete_name', inv.athlete_name,
      'role_granted', 'coach', 'source', 'coach_invite'
    );
  END IF;

  -- B) Fallback: Legacy-Code direkt auf der athletes-Zeile
  SELECT * INTO rec
    FROM public.athletes
   WHERE claim_code = input_code AND claim_code_used_at IS NULL
   LIMIT 1;
  rec_found := FOUND;
  IF NOT rec_found THEN
    INSERT INTO public.claim_code_attempts(user_id) VALUES (auth.uid());
    RAISE EXCEPTION 'Code ungültig oder bereits eingelöst';
  END IF;
  IF rec.auth_user_id = auth.uid() OR rec.created_by_coach_id = auth.uid() THEN
    RAISE EXCEPTION 'Du kannst deinen eigenen Code nicht einlösen';
  END IF;

  IF rec.auth_user_id IS NULL THEN
    -- Richtung 1: Sportler claimt einen vom Trainer angelegten Eintrag
    DELETE FROM public.athletes
     WHERE auth_user_id = auth.uid() AND created_by_coach_id IS NULL AND id != rec.id;
    UPDATE public.athletes
       SET auth_user_id = auth.uid(), claim_code = NULL, claim_code_used_at = now()
     WHERE id = rec.id;
    result := jsonb_build_object('athlete_id', rec.id, 'athlete_name', rec.name,
                                 'role_granted', 'athlete', 'source', 'athlete_claim');
  ELSIF rec.created_by_coach_id IS NULL THEN
    -- Richtung 2: jemand bekommt per Code Trainer-/Lesezugriff auf diesen
    -- Sportler (z. B. "ich teile meine eigenen Daten"). KEINE Rollen-Sperre.
    UPDATE public.athletes
       SET created_by_coach_id = auth.uid(), claim_code = NULL, claim_code_used_at = now()
     WHERE id = rec.id;
    INSERT INTO athlete_coaches (athlete_id, coach_id)
    VALUES (rec.id, auth.uid()) ON CONFLICT DO NOTHING;
    result := jsonb_build_object('athlete_id', rec.id, 'athlete_name', rec.name,
                                 'role_granted', 'coach', 'source', 'legacy_athlete_code');
  ELSE
    RAISE EXCEPTION 'Sportler ist bereits verknüpft';
  END IF;

  DELETE FROM public.claim_code_attempts WHERE user_id = auth.uid();
  RETURN result;
END;
$$;

-- ---------- (3) Stille 24-h-Auto-Rotation abschalten ----------
-- Signatur bleibt erhalten (Frontend ruft sie auf), tut aber nichts mehr:
-- weitergegebene Codes sollen NICHT mehr unbemerkt ungültig werden.
CREATE OR REPLACE FUNCTION public.rotate_stale_coach_invites(target_athlete_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Bewusst deaktiviert: Codes bleiben gültig bis Einlösen oder manuellem
  -- Widerruf. Brute-Force-Schutz übernimmt das Rate-Limit in
  -- redeem_athlete_code (max. 10 Fehlversuche pro Stunde).
  RETURN jsonb_build_object('rotated', 0);
END;
$$;
