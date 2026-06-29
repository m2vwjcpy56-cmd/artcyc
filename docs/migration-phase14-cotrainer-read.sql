-- =====================================================
-- Phase 14 — Co-Trainer dürfen "ihren" Sportler sehen
-- =====================================================
-- Symptom: Ein per Code verknüpfter Trainer (athlete_coaches)
-- sieht den Sportler NICHT im Picker. Ursache: die live athletes_select-
-- Policy enthält die Co-Trainer-Klausel nicht (von einer späteren
-- Migration überschrieben). Hier idempotent neu setzen.
-- Gefahrlos mehrfach ausführbar.
-- =====================================================

-- Helper: bin ich (auth.uid) Co-Trainer dieses Sportlers?
CREATE OR REPLACE FUNCTION public.user_is_coach_of(athlete_uuid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM athlete_coaches
    WHERE athlete_id = athlete_uuid AND coach_id = auth.uid()
  )
$$;

-- Helper: besitze ich diesen Sportler-Eintrag (eigener oder von mir angelegt)?
CREATE OR REPLACE FUNCTION public.user_owns_athlete(athlete_uuid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = athlete_uuid
      AND (auth_user_id = auth.uid() OR created_by_coach_id = auth.uid())
  )
$$;

-- athletes: Co-Trainer dürfen lesen (Picker-Sichtbarkeit).
DROP POLICY IF EXISTS "athletes_select" ON athletes;
CREATE POLICY "athletes_select" ON athletes FOR SELECT USING (
  auth_user_id = auth.uid()
  OR created_by_coach_id = auth.uid()
  OR public.user_is_coach_of(id)
  OR public.is_admin()
);

-- athlete_coaches: jeder darf SEINE eigene Trainer-Verknüpfung lesen
-- (sonst taucht der Sportler nicht in availableAthletes auf).
DROP POLICY IF EXISTS "athlete_coaches_select" ON athlete_coaches;
CREATE POLICY "athlete_coaches_select" ON athlete_coaches FOR SELECT USING (
  coach_id = auth.uid()
  OR public.user_owns_athlete(athlete_id)
  OR public.is_admin()
);
