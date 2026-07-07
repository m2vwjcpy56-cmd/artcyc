-- =====================================================
-- Phase 15 — Co-Trainer-Lesezugriff vollständig + dauerhaft
-- =====================================================
-- Symptom (2026-07-07): Co-Trainer „Marius" (per athlete_coaches mit einem
-- Sportler verknüpft) sah dessen Daten NICHT — leeres Dashboard, Sportler
-- fehlte im Picker.
--
-- Ursache: Zwei Migrationen streiten um athletes_select. Phase 14 ergänzte die
-- Co-Trainer-Klausel; eine spätere TEAM-Migration überschrieb athletes_select
-- mit visible_via_team()/coaches_team_member() und WARF DIE CO-TRAINER-KLAUSEL
-- WIEDER RAUS. Zusätzlich kannten can_access_athlete (→ sessions/competitions)
-- und programs/exercises_select den direkten Co-Trainer-Pfad nie.
--
-- Fix: athletes_select als VOLLSTÄNDIGEN Union setzen (Owner/Creator/Admin
-- + Team + Co-Trainer) und den Co-Trainer-Pfad auch in can_access_athlete
-- sowie programs/exercises_select ergänzen. Idempotent, gefahrlos mehrfach.
--
-- ⚠️ WICHTIG bei künftigen Migrationen: athletes_select IMMER als kompletten
--    Union neu setzen — sonst kippt wieder eine Klausel weg.
-- =====================================================

-- Helper: bin ich (auth.uid) direkter Co-Trainer dieses Sportlers?
CREATE OR REPLACE FUNCTION public.user_is_coach_of(athlete_uuid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM athlete_coaches
    WHERE athlete_id = athlete_uuid AND coach_id = auth.uid()
  )
$$;

-- Helper: ist owner_uuid Besitzer (auth_user_id ODER created_by_coach_id) eines
-- Sportlers, den ich als Co-Trainer betreue? → für programs/exercises (owner-basiert).
CREATE OR REPLACE FUNCTION public.owns_cocoached_athlete(owner_uuid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT owner_uuid IS NOT NULL AND EXISTS (
    SELECT 1 FROM athletes a
    JOIN athlete_coaches ac ON ac.athlete_id = a.id
    WHERE ac.coach_id = auth.uid()
      AND (a.auth_user_id = owner_uuid OR a.created_by_coach_id = owner_uuid)
  )
$$;

-- athletes: VOLLSTÄNDIGER Union — Owner/Creator/Admin + Team + Co-Trainer.
DROP POLICY IF EXISTS "athletes_select" ON athletes;
CREATE POLICY "athletes_select" ON athletes FOR SELECT USING (
  auth_user_id = auth.uid()
  OR created_by_coach_id = auth.uid()
  OR is_admin()
  OR visible_via_team(id)
  OR coaches_team_member(id)
  OR user_is_coach_of(id)
);

-- sessions + competitions nutzen can_access_athlete → Co-Trainer-Pfad ergänzen.
CREATE OR REPLACE FUNCTION public.can_access_athlete(athlete_uuid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM athletes WHERE id = athlete_uuid
      AND (auth_user_id = auth.uid() OR created_by_coach_id = auth.uid() OR is_admin())
  )
  OR is_team_member(athlete_uuid)
  OR coaches_team_member(athlete_uuid)
  OR user_is_coach_of(athlete_uuid)
$$;

-- programs/exercises (owner_id-basiert): Co-Trainer liest die Bibliothek des
-- Besitzers eines mitbetreuten Sportlers — sonst zeigen programm-verknüpfte
-- Wettkämpfe ohne Inline-Punkte keinen Score/keine Übungen.
DROP POLICY IF EXISTS "programs_select" ON programs;
CREATE POLICY "programs_select" ON programs FOR SELECT USING (
  owner_id IS NULL OR owner_id = auth.uid() OR is_admin() OR owns_cocoached_athlete(owner_id)
);

DROP POLICY IF EXISTS "exercises_select" ON exercises;
CREATE POLICY "exercises_select" ON exercises FOR SELECT USING (
  owner_id IS NULL OR owner_id = auth.uid() OR is_admin() OR owns_cocoached_athlete(owner_id)
);
