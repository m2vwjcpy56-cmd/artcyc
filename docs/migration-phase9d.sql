-- =====================================================
-- Phase 9d-1 — Schema-Ergänzungen + RLS für Trainer-Schreibrechte
-- =====================================================

-- =====================================================
-- 1) Fehlende Spalten ergänzen
-- =====================================================

-- competitions.target_score (Phase 6 — Wettkampf-Vorbereitungs-Modus)
ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS target_score NUMERIC;

-- exercises: Phase 5 (Ziel-Quote) + Phase Status-Labels
ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS target_rate INTEGER,
  ADD COLUMN IF NOT EXISTS success_label TEXT,
  ADD COLUMN IF NOT EXISTS fail_label TEXT;

-- session.exercise_name + session.notes (notes existiert schon, name fehlt)
-- Wir referenzieren mit FK auf exercises(id) — aber für Migration kompakte
-- Variante: zusätzlich exercise_name TEXT damit historische Daten lesbar
-- bleiben falls FK mal bricht.
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS exercise_name TEXT;

-- =====================================================
-- 2) RLS-Policies: Sessions + Competitions
-- =====================================================
-- Coach kann lesen UND schreiben für Athleten zu denen er Zugriff hat
-- (created_by_coach_id-Linkage oder is_admin). Athlet kann eigene Sessions.

DROP POLICY IF EXISTS sessions_select ON public.sessions;
DROP POLICY IF EXISTS sessions_write ON public.sessions;

CREATE POLICY sessions_select ON public.sessions
  FOR SELECT TO authenticated
  USING (public.can_access_athlete(athlete_id));

CREATE POLICY sessions_write ON public.sessions
  FOR ALL TO authenticated
  USING (public.can_access_athlete(athlete_id))
  WITH CHECK (public.can_access_athlete(athlete_id));

DROP POLICY IF EXISTS competitions_select ON public.competitions;
DROP POLICY IF EXISTS competitions_write ON public.competitions;

CREATE POLICY competitions_select ON public.competitions
  FOR SELECT TO authenticated
  USING (public.can_access_athlete(athlete_id));

CREATE POLICY competitions_write ON public.competitions
  FOR ALL TO authenticated
  USING (public.can_access_athlete(athlete_id))
  WITH CHECK (public.can_access_athlete(athlete_id));

-- =====================================================
-- 3) RLS-Policies: Programs + Exercises
-- =====================================================
-- Beide: globale Einträge (owner_id NULL) für alle lesbar,
-- eigene les+schreibbar, Admin alles, Coach sieht Programme die
-- Wettkampf-Daten seiner Sportler nutzen.

DROP POLICY IF EXISTS exercises_select ON public.exercises;
DROP POLICY IF EXISTS exercises_write  ON public.exercises;

CREATE POLICY exercises_select ON public.exercises
  FOR SELECT TO authenticated
  USING (
    owner_id IS NULL
    OR owner_id = auth.uid()
    OR public.is_admin()
    -- Coach sieht Übungen von Athleten die er coacht
    OR EXISTS (
      SELECT 1 FROM public.athletes a
      WHERE a.created_by_coach_id = auth.uid()
        AND a.auth_user_id = exercises.owner_id
    )
  );

CREATE POLICY exercises_write ON public.exercises
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR (owner_id IS NULL AND public.is_admin()))
  WITH CHECK (owner_id = auth.uid() OR (owner_id IS NULL AND public.is_admin()));

DROP POLICY IF EXISTS programs_select ON public.programs;
DROP POLICY IF EXISTS programs_write  ON public.programs;

CREATE POLICY programs_select ON public.programs
  FOR SELECT TO authenticated
  USING (
    owner_id IS NULL
    OR owner_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.athletes a
      WHERE a.created_by_coach_id = auth.uid()
        AND a.auth_user_id = programs.owner_id
    )
  );

CREATE POLICY programs_write ON public.programs
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR (owner_id IS NULL AND public.is_admin()))
  WITH CHECK (owner_id = auth.uid() OR (owner_id IS NULL AND public.is_admin()));

-- =====================================================
-- 4) Helper-Funktion für Blob → Tables Migration
-- =====================================================
-- Migriert das gesamte JSONB-Snapshot eines Users in die relationalen
-- Tabellen. Idempotent (mehrfaches Aufrufen schadet nicht — bereits
-- existierende Einträge werden via id-Konflikt aktualisiert).
--
-- Mapping-Strategie: blob-IDs (zB "p_ex_0_1234567890") werden als
-- NEUE UUIDs in DB gespeichert. Eine Map blob_id → uuid wird beim
-- Migrieren mitgeführt um session.exerciseId + competition.program_id
-- korrekt zu setzen.

CREATE OR REPLACE FUNCTION public.migrate_blob_to_tables()
RETURNS jsonb AS $$
DECLARE
  uid UUID := auth.uid();
  blob JSONB;
  ex JSONB;
  prog JSONB;
  sess JSONB;
  comp JSONB;
  new_ex_id UUID;
  new_prog_id UUID;
  ex_id_map JSONB := '{}'::jsonb;
  prog_id_map JSONB := '{}'::jsonb;
  cnt_ex INT := 0;
  cnt_prog INT := 0;
  cnt_sess INT := 0;
  cnt_comp INT := 0;
  athlete_id_for_self UUID;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Nicht angemeldet';
  END IF;

  -- Eigene athlete_id rausfinden (falls vorhanden, vom Signup-Trigger)
  SELECT id INTO athlete_id_for_self FROM public.athletes WHERE auth_user_id = uid LIMIT 1;

  SELECT data INTO blob FROM public.user_data_snapshots WHERE user_id = uid;
  IF blob IS NULL THEN
    RETURN jsonb_build_object('error', 'Kein Snapshot gefunden');
  END IF;

  -- 1. Exercises migrieren
  FOR ex IN SELECT * FROM jsonb_array_elements(COALESCE(blob->'exercises', '[]'::jsonb)) LOOP
    new_ex_id := gen_random_uuid();
    ex_id_map := ex_id_map || jsonb_build_object(ex->>'id', new_ex_id::text);
    INSERT INTO public.exercises (
      id, owner_id, name, uci_code, uci_disc, points, active,
      category_mode, third_label, success_label, fail_label,
      default_series, target_rate, created_at
    ) VALUES (
      new_ex_id, uid,
      ex->>'name',
      ex->>'uci_code',
      ex->>'uci_disc',
      (ex->>'points')::numeric,
      COALESCE((ex->>'active')::boolean, true),
      COALESCE((ex->>'category_mode')::int, 2),
      ex->>'third_label',
      ex->>'success_label',
      ex->>'fail_label',
      COALESCE((ex->>'default_series')::int, 10),
      CASE WHEN (ex->>'target_rate') ~ '^\d+$' THEN (ex->>'target_rate')::int ELSE NULL END,
      NOW()
    ) ON CONFLICT (id) DO NOTHING;
    cnt_ex := cnt_ex + 1;
  END LOOP;

  -- 2. Programs migrieren (exercises-Array bleibt JSONB, aber wir
  --    aktualisieren darin die id-Referenzen falls möglich)
  FOR prog IN SELECT * FROM jsonb_array_elements(COALESCE(blob->'programs', '[]'::jsonb)) LOOP
    new_prog_id := gen_random_uuid();
    prog_id_map := prog_id_map || jsonb_build_object(prog->>'id', new_prog_id::text);
    INSERT INTO public.programs (
      id, owner_id, name, discipline, exercises, created_at
    ) VALUES (
      new_prog_id, uid,
      prog->>'name',
      prog->>'discipline',
      COALESCE(prog->'exercises', '[]'::jsonb),
      NOW()
    ) ON CONFLICT (id) DO NOTHING;
    cnt_prog := cnt_prog + 1;
  END LOOP;

  -- 3. Sessions migrieren — athlete_id auf eigenen Athleten setzen
  --    wenn session.athleteId NULL ist; sonst auf den entsprechenden
  FOR sess IN SELECT * FROM jsonb_array_elements(COALESCE(blob->'sessions', '[]'::jsonb)) LOOP
    DECLARE
      session_athlete_id UUID;
      session_exercise_id UUID;
      mapped_ex TEXT;
    BEGIN
      session_athlete_id := NULLIF(sess->>'athleteId', '')::uuid;
      IF session_athlete_id IS NULL THEN
        session_athlete_id := athlete_id_for_self;
      END IF;
      IF session_athlete_id IS NULL THEN
        -- Kein Athlete-Eintrag — Session überspringen
        CONTINUE;
      END IF;
      mapped_ex := ex_id_map->>(sess->>'exerciseId');
      IF mapped_ex IS NULL THEN
        -- Übung nicht im Blob gefunden — Session überspringen
        CONTINUE;
      END IF;
      session_exercise_id := mapped_ex::uuid;
      INSERT INTO public.sessions (
        athlete_id, exercise_id, date, entries, notes, exercise_name, created_at
      ) VALUES (
        session_athlete_id, session_exercise_id,
        COALESCE((sess->>'date')::date, CURRENT_DATE),
        COALESCE(sess->'entries', '[]'::jsonb),
        COALESCE(sess->>'notes', ''),
        sess->>'exerciseName',
        NOW()
      );
      cnt_sess := cnt_sess + 1;
    EXCEPTION WHEN OTHERS THEN
      -- skip on error
      NULL;
    END;
  END LOOP;

  -- 4. Competitions migrieren
  FOR comp IN SELECT * FROM jsonb_array_elements(COALESCE(blob->'competitions', '[]'::jsonb)) LOOP
    DECLARE
      comp_athlete_id UUID;
      mapped_prog TEXT;
      comp_program_id UUID;
    BEGIN
      comp_athlete_id := NULLIF(comp->>'athlete_id', '')::uuid;
      IF comp_athlete_id IS NULL THEN
        comp_athlete_id := athlete_id_for_self;
      END IF;
      IF comp_athlete_id IS NULL THEN
        CONTINUE;
      END IF;
      mapped_prog := prog_id_map->>(comp->>'program_id');
      comp_program_id := CASE WHEN mapped_prog IS NOT NULL THEN mapped_prog::uuid ELSE NULL END;
      INSERT INTO public.competitions (
        athlete_id, program_id, name, date, location, host, start_nr,
        table1, table2, t1_schwierigkeit, t2_schwierigkeit, pdf_ref,
        target_score, created_at
      ) VALUES (
        comp_athlete_id, comp_program_id,
        comp->>'name',
        COALESCE((comp->>'date')::date, CURRENT_DATE),
        COALESCE(comp->>'location', ''),
        COALESCE(comp->>'host', ''),
        COALESCE(comp->>'start_nr', ''),
        COALESCE(comp->'table1', '[]'::jsonb),
        COALESCE(comp->'table2', '[]'::jsonb),
        COALESCE((comp->>'t1_schwierigkeit')::numeric, 0),
        COALESCE((comp->>'t2_schwierigkeit')::numeric, 0),
        comp->'pdf_ref',
        CASE WHEN (comp->>'target_score') ~ '^\d+(\.\d+)?$'
             THEN (comp->>'target_score')::numeric ELSE NULL END,
        NOW()
      );
      cnt_comp := cnt_comp + 1;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;

  -- Snapshot mit Migration-Flag versehen
  UPDATE public.user_data_snapshots
    SET data = jsonb_set(data, '{migrated_to_tables}', 'true'::jsonb, true)
    WHERE user_id = uid;

  RETURN jsonb_build_object(
    'exercises', cnt_ex,
    'programs', cnt_prog,
    'sessions', cnt_sess,
    'competitions', cnt_comp
  );
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
