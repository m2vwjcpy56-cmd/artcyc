-- =============================================================
-- Phase 11 — Multi-Trainer pro Sportler (deployed 2026-05-18)
-- =============================================================
-- Mehrere Trainer pro Sportler möglich, jeder mit eigenem Code.
-- Codes rotieren automatisch alle 24h solange nicht eingelöst.
-- bestehendes `athletes.created_by_coach_id` bleibt als „Haupt-Coach"
-- für Rückwärts-Kompatibilität; Spiegelung in athlete_coaches.

-- =====================================================
-- 1) athlete_coaches — Join-Tabelle (N:M)
-- =====================================================
CREATE TABLE IF NOT EXISTS athlete_coaches (
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  coach_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (athlete_id, coach_id)
);
CREATE INDEX IF NOT EXISTS athlete_coaches_coach_idx ON athlete_coaches(coach_id);

-- Bestehende created_by_coach_id Beziehungen spiegeln
INSERT INTO athlete_coaches (athlete_id, coach_id)
SELECT id, created_by_coach_id FROM athletes
WHERE created_by_coach_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2) coach_invites — ein Code pro Trainer-Slot
-- =====================================================
CREATE TABLE IF NOT EXISTS coach_invites (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id            UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  claim_code            TEXT NOT NULL UNIQUE,
  label                 TEXT,
  claim_code_rotated_at TIMESTAMPTZ DEFAULT NOW(),
  used_at               TIMESTAMPTZ,
  used_by_coach_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS coach_invites_athlete_idx ON coach_invites(athlete_id);
CREATE INDEX IF NOT EXISTS coach_invites_code_idx ON coach_invites(claim_code) WHERE used_at IS NULL;

-- =====================================================
-- 3) RLS — Sportler verwaltet, Coach sieht eigene, Admin alles
-- =====================================================
ALTER TABLE athlete_coaches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "athlete_coaches_select" ON athlete_coaches;
DROP POLICY IF EXISTS "athlete_coaches_insert" ON athlete_coaches;
DROP POLICY IF EXISTS "athlete_coaches_delete" ON athlete_coaches;
CREATE POLICY "athlete_coaches_select" ON athlete_coaches FOR SELECT USING (
  coach_id = auth.uid()
  OR EXISTS (SELECT 1 FROM athletes a WHERE a.id = athlete_id AND a.auth_user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "athlete_coaches_insert" ON athlete_coaches FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM athletes a WHERE a.id = athlete_id AND a.auth_user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "athlete_coaches_delete" ON athlete_coaches FOR DELETE USING (
  coach_id = auth.uid()
  OR EXISTS (SELECT 1 FROM athletes a WHERE a.id = athlete_id AND a.auth_user_id = auth.uid())
  OR is_admin()
);

ALTER TABLE coach_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coach_invites_select" ON coach_invites;
DROP POLICY IF EXISTS "coach_invites_write" ON coach_invites;
CREATE POLICY "coach_invites_select" ON coach_invites FOR SELECT USING (
  EXISTS (SELECT 1 FROM athletes a WHERE a.id = athlete_id AND a.auth_user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "coach_invites_write" ON coach_invites FOR ALL USING (
  EXISTS (SELECT 1 FROM athletes a WHERE a.id = athlete_id AND a.auth_user_id = auth.uid())
  OR is_admin()
) WITH CHECK (
  EXISTS (SELECT 1 FROM athletes a WHERE a.id = athlete_id AND a.auth_user_id = auth.uid())
  OR is_admin()
);

-- =====================================================
-- 4) can_access_athlete: jetzt auch über athlete_coaches
-- =====================================================
CREATE OR REPLACE FUNCTION can_access_athlete(athlete_uuid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = athlete_uuid
      AND (auth_user_id = auth.uid() OR created_by_coach_id = auth.uid() OR is_admin())
  ) OR EXISTS (
    SELECT 1 FROM athlete_coaches
    WHERE athlete_id = athlete_uuid AND coach_id = auth.uid()
  )
$$;

-- =====================================================
-- 5) RPCs
-- =====================================================

-- generate_coach_invite: legt einen frischen Code für einen Sportler an
CREATE OR REPLACE FUNCTION generate_coach_invite(
  target_athlete_id UUID,
  label_text TEXT DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_code TEXT;
  result   JSONB;
  tries    INT := 0;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = target_athlete_id AND auth_user_id = auth.uid()
  ) AND NOT is_admin() THEN
    RAISE EXCEPTION 'Du darfst keinen Code fuer diesen Sportler generieren';
  END IF;

  LOOP
    new_code := generate_claim_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM coach_invites WHERE claim_code = new_code)
          AND NOT EXISTS (SELECT 1 FROM athletes      WHERE claim_code = new_code);
    tries := tries + 1;
    IF tries > 20 THEN RAISE EXCEPTION 'Konnte keinen eindeutigen Code generieren'; END IF;
  END LOOP;

  INSERT INTO coach_invites (athlete_id, claim_code, label)
  VALUES (target_athlete_id, new_code, label_text)
  RETURNING jsonb_build_object(
    'id', id, 'claim_code', claim_code,
    'label', label, 'rotated_at', claim_code_rotated_at
  ) INTO result;
  RETURN result;
END;
$$;

-- rotate_stale_coach_invites: alle nicht eingelösten Codes >24h erneuern
CREATE OR REPLACE FUNCTION rotate_stale_coach_invites(target_athlete_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  rec record; new_code TEXT; rotated_count INT := 0; tries INT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = target_athlete_id AND auth_user_id = auth.uid()
  ) AND NOT is_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;

  FOR rec IN
    SELECT id FROM coach_invites
    WHERE athlete_id = target_athlete_id
      AND used_at IS NULL
      AND claim_code_rotated_at < (now() - interval '24 hours')
  LOOP
    tries := 0;
    LOOP
      new_code := generate_claim_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM coach_invites WHERE claim_code = new_code)
            AND NOT EXISTS (SELECT 1 FROM athletes      WHERE claim_code = new_code);
      tries := tries + 1; IF tries > 20 THEN EXIT; END IF;
    END LOOP;
    UPDATE coach_invites
       SET claim_code = new_code, claim_code_rotated_at = now()
     WHERE id = rec.id;
    rotated_count := rotated_count + 1;
  END LOOP;
  RETURN jsonb_build_object('rotated', rotated_count);
END;
$$;

-- redeem_athlete_code (NEU):
--   1) versucht zuerst coach_invites (= primärer Pfad ab Phase 11)
--   2) fällt zurück auf athletes.claim_code (Legacy):
--      • auth_user_id NULL → Sportler claimt sich
--      • created_by_coach_id NULL → Coach hinzufügen (und in
--        athlete_coaches mirrowen)
--   is_coach()-Check ENTFÄLLT: auch Sportler-Profile können
--   andere Sportler als Trainer einlösen (Hybrid-Rollen).
CREATE OR REPLACE FUNCTION redeem_athlete_code(input_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  rec record; inv record;
  inv_found BOOLEAN; rec_found BOOLEAN;
  result JSONB; recent_failed_count INT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Nicht angemeldet'; END IF;

  DELETE FROM public.claim_code_attempts WHERE attempted_at < now() - interval '1 hour';
  SELECT count(*) INTO recent_failed_count
    FROM public.claim_code_attempts
   WHERE user_id = auth.uid()
     AND attempted_at > now() - interval '1 hour';
  IF recent_failed_count >= 10 THEN
    RAISE EXCEPTION 'Zu viele falsche Versuche. Warte 1 Stunde und probiere es erneut.';
  END IF;

  input_code := upper(replace(replace(input_code, ' ', ''), '-', ''));

  SELECT ci.*, a.name AS athlete_name, a.auth_user_id AS athlete_user
    INTO inv
    FROM coach_invites ci
    JOIN athletes a ON a.id = ci.athlete_id
   WHERE ci.claim_code = input_code AND ci.used_at IS NULL
   LIMIT 1;
  inv_found := FOUND;
  IF inv_found THEN
    IF inv.athlete_user = auth.uid() THEN
      RAISE EXCEPTION 'Du kannst deinen eigenen Code nicht einloesen';
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

  SELECT * INTO rec
    FROM public.athletes
   WHERE claim_code = input_code AND claim_code_used_at IS NULL
   LIMIT 1;
  rec_found := FOUND;
  IF NOT rec_found THEN
    INSERT INTO public.claim_code_attempts(user_id) VALUES (auth.uid());
    RAISE EXCEPTION 'Code ungueltig oder bereits eingeloest';
  END IF;
  IF rec.auth_user_id = auth.uid() OR rec.created_by_coach_id = auth.uid() THEN
    RAISE EXCEPTION 'Du kannst deinen eigenen Code nicht einloesen';
  END IF;

  IF rec.auth_user_id IS NULL THEN
    DELETE FROM public.athletes
     WHERE auth_user_id = auth.uid() AND created_by_coach_id IS NULL AND id != rec.id;
    UPDATE public.athletes
       SET auth_user_id = auth.uid(), claim_code = NULL, claim_code_used_at = now()
     WHERE id = rec.id;
    result := jsonb_build_object('athlete_id', rec.id, 'athlete_name', rec.name,
                                 'role_granted', 'athlete', 'source', 'athlete_claim');
  ELSIF rec.created_by_coach_id IS NULL THEN
    UPDATE public.athletes
       SET created_by_coach_id = auth.uid(), claim_code = NULL, claim_code_used_at = now()
     WHERE id = rec.id;
    INSERT INTO athlete_coaches (athlete_id, coach_id)
    VALUES (rec.id, auth.uid()) ON CONFLICT DO NOTHING;
    result := jsonb_build_object('athlete_id', rec.id, 'athlete_name', rec.name,
                                 'role_granted', 'coach', 'source', 'legacy_athlete_code');
  ELSE
    RAISE EXCEPTION 'Sportler ist bereits verknuepft';
  END IF;

  DELETE FROM public.claim_code_attempts WHERE user_id = auth.uid();
  RETURN result;
END;
$$;
