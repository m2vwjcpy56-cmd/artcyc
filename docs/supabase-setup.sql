-- =====================================================
-- ArtCyc Coach — Supabase Schema
-- =====================================================
-- Komplett im Supabase-SQL-Editor ausführen (einmalig).
-- Erst danach: Anon-Key + Project-URL in der App eintragen.

-- =====================================================
-- 1) PROFILES — verknüpft mit auth.users
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2) ATHLETES — kann mit/ohne User-Account existieren
-- =====================================================
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'athlete', -- 'athlete' | 'team'
  notes TEXT DEFAULT '',
  email TEXT DEFAULT '',
  -- User-Verknüpfung (NULL = vom Trainer ohne Account angelegt)
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Trainer der diesen Sportler angelegt hat (NULL = selbst registrierter Sportler)
  created_by_coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Claim-Code (6-stellig) zum Verknüpfen mit eigenem Account
  claim_code TEXT UNIQUE,
  claim_code_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Eindeutigkeit: ein User kann max. einen athlete-Eintrag mit auth_user_id haben (vermeidet Doppel-Sportler)
  CONSTRAINT athletes_unique_user UNIQUE (auth_user_id)
);
CREATE INDEX IF NOT EXISTS athletes_coach_idx ON athletes(created_by_coach_id) WHERE created_by_coach_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS athletes_user_idx ON athletes(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS athletes_claim_idx ON athletes(claim_code) WHERE claim_code IS NOT NULL;

-- =====================================================
-- 3) EXERCISES (UCI-Übungen + custom)
-- =====================================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Besitzer: NULL = globaler UCI-Eintrag (nur Admin schreibbar), sonst pro User
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  uci_code TEXT,
  uci_disc TEXT,
  points NUMERIC,
  active BOOLEAN DEFAULT TRUE,
  category_mode INT DEFAULT 2,
  third_label TEXT,
  default_series INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS exercises_owner_idx ON exercises(owner_id);

-- =====================================================
-- 4) PROGRAMS — Wettkampf-Programme
-- =====================================================
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  discipline TEXT, -- '1er' | '2er' | '4er' | '6er'
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{id,nr,name,code,points}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS programs_owner_idx ON programs(owner_id);

-- =====================================================
-- 5) SESSIONS — Trainings-Sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  entries JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['success'|'fail'|'third', ...]
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sessions_athlete_idx ON sessions(athlete_id);
CREATE INDEX IF NOT EXISTS sessions_date_idx ON sessions(date);

-- =====================================================
-- 6) COMPETITIONS — Wettkämpfe
-- =====================================================
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT DEFAULT '',
  host TEXT DEFAULT '',
  start_nr TEXT DEFAULT '',
  table1 JSONB NOT NULL DEFAULT '[]'::jsonb,
  table2 JSONB NOT NULL DEFAULT '[]'::jsonb,
  t1_schwierigkeit NUMERIC DEFAULT 0,
  t2_schwierigkeit NUMERIC DEFAULT 0,
  pdf_ref JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS competitions_athlete_idx ON competitions(athlete_id);

-- =====================================================
-- 7) HELPER-FUNKTIONEN
-- =====================================================

-- Ist der eingeloggte User Admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Ist der eingeloggte User Coach?
CREATE OR REPLACE FUNCTION is_coach()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin'))
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Ist ein bestimmter Athlete für mich sichtbar/editierbar?
CREATE OR REPLACE FUNCTION can_access_athlete(athlete_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = athlete_uuid
      AND (
        auth_user_id = auth.uid()
        OR created_by_coach_id = auth.uid()
        OR is_admin()
      )
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Generiert einen 6-stelligen alphanumerischen Claim-Code (vermeidet ähnliche Zeichen wie 0/O, 1/I)
CREATE OR REPLACE FUNCTION generate_claim_code()
RETURNS TEXT AS $$
DECLARE
  alphabet TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substring(alphabet FROM (1 + floor(random() * length(alphabet))::int) FOR 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Sportler einlösen: setzt auth_user_id auf den eingeloggten User
CREATE OR REPLACE FUNCTION claim_athlete(input_code TEXT)
RETURNS UUID AS $$
DECLARE
  matched_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Nicht angemeldet';
  END IF;
  -- Sportler mit diesem Code finden, der noch nicht verknüpft ist
  SELECT id INTO matched_id FROM athletes
   WHERE claim_code = upper(input_code)
     AND auth_user_id IS NULL
     AND claim_code_used_at IS NULL
   LIMIT 1;
  IF matched_id IS NULL THEN
    RAISE EXCEPTION 'Code ungültig oder bereits eingelöst';
  END IF;
  -- Verknüpfen
  UPDATE athletes
     SET auth_user_id = auth.uid(),
         claim_code_used_at = NOW()
   WHERE id = matched_id;
  RETURN matched_id;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- =====================================================
-- 8) TRIGGER: Beim ersten User automatisch Admin, sonst Rolle aus Signup-Metadata
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first BOOLEAN;
  chosen_role TEXT;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) INTO is_first;
  -- Role aus Signup-Metadata, default 'athlete'
  chosen_role := COALESCE(NEW.raw_user_meta_data->>'role', 'athlete');
  IF chosen_role NOT IN ('athlete', 'coach') THEN
    chosen_role := 'athlete';
  END IF;
  -- Erster User immer Admin
  IF is_first THEN chosen_role := 'admin'; END IF;

  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    chosen_role,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );

  -- Wenn Rolle 'athlete' ODER 'admin' (Admin trainiert ja auch ggf. selbst): Athlete-Eintrag automatisch
  -- Coaches starten mit leerer Liste
  IF chosen_role IN ('athlete', 'admin') THEN
    INSERT INTO public.athletes (name, auth_user_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 9) ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises     ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions  ENABLE ROW LEVEL SECURITY;

-- Bestehende Policies entfernen falls Re-Run
DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_update ON profiles;
DROP POLICY IF EXISTS profiles_insert ON profiles;
DROP POLICY IF EXISTS athletes_select ON athletes;
DROP POLICY IF EXISTS athletes_insert ON athletes;
DROP POLICY IF EXISTS athletes_update ON athletes;
DROP POLICY IF EXISTS athletes_delete ON athletes;
DROP POLICY IF EXISTS exercises_select ON exercises;
DROP POLICY IF EXISTS exercises_write  ON exercises;
DROP POLICY IF EXISTS programs_select  ON programs;
DROP POLICY IF EXISTS programs_write   ON programs;
DROP POLICY IF EXISTS sessions_select  ON sessions;
DROP POLICY IF EXISTS sessions_write   ON sessions;
DROP POLICY IF EXISTS competitions_select ON competitions;
DROP POLICY IF EXISTS competitions_write  ON competitions;

-- PROFILES: jeder sieht alle Display-Namen (für Trainer-Sportler-Anzeige), nur eigenes änderbar.
CREATE POLICY profiles_select ON profiles
  FOR SELECT TO authenticated
  USING (true);
CREATE POLICY profiles_update ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role IN ('athlete', 'coach')); -- Rolle nicht selbst auf admin hochstufen
CREATE POLICY profiles_insert ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- ATHLETES: sichtbar wenn ich der User bin ODER der Coach ODER Admin.
CREATE POLICY athletes_select ON athletes
  FOR SELECT TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR created_by_coach_id = auth.uid()
    OR is_admin()
  );
-- Anlegen: nur Coach/Admin (Sportler-Self wird vom Trigger angelegt)
CREATE POLICY athletes_insert ON athletes
  FOR INSERT TO authenticated
  WITH CHECK (
    is_coach()
    AND created_by_coach_id = auth.uid()
  );
-- Update: eigener Eintrag ODER Coach der ihn angelegt hat
CREATE POLICY athletes_update ON athletes
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid() OR created_by_coach_id = auth.uid() OR is_admin())
  WITH CHECK (auth_user_id = auth.uid() OR created_by_coach_id = auth.uid() OR is_admin());
-- Löschen: nur der erstellende Coach oder Admin
CREATE POLICY athletes_delete ON athletes
  FOR DELETE TO authenticated
  USING (created_by_coach_id = auth.uid() OR is_admin());

-- EXERCISES: globale (owner_id NULL) für alle lesbar; eigene les/schreibbar; Admin alles.
CREATE POLICY exercises_select ON exercises
  FOR SELECT TO authenticated
  USING (owner_id IS NULL OR owner_id = auth.uid() OR is_admin());
CREATE POLICY exercises_write ON exercises
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR (owner_id IS NULL AND is_admin()))
  WITH CHECK (owner_id = auth.uid() OR (owner_id IS NULL AND is_admin()));

-- PROGRAMS: gleiche Logik wie Exercises (globale + eigene + Admin alles).
CREATE POLICY programs_select ON programs
  FOR SELECT TO authenticated
  USING (owner_id IS NULL OR owner_id = auth.uid() OR is_admin());
CREATE POLICY programs_write ON programs
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR (owner_id IS NULL AND is_admin()))
  WITH CHECK (owner_id = auth.uid() OR (owner_id IS NULL AND is_admin()));

-- SESSIONS: sichtbar wenn der zugehörige Athlete für mich zugänglich ist.
CREATE POLICY sessions_select ON sessions
  FOR SELECT TO authenticated
  USING (can_access_athlete(athlete_id));
CREATE POLICY sessions_write ON sessions
  FOR ALL TO authenticated
  USING (can_access_athlete(athlete_id))
  WITH CHECK (can_access_athlete(athlete_id));

-- COMPETITIONS: gleiche Logik wie Sessions.
CREATE POLICY competitions_select ON competitions
  FOR SELECT TO authenticated
  USING (can_access_athlete(athlete_id));
CREATE POLICY competitions_write ON competitions
  FOR ALL TO authenticated
  USING (can_access_athlete(athlete_id))
  WITH CHECK (can_access_athlete(athlete_id));

-- =====================================================
-- 10) FERTIG. Im Supabase-Dashboard noch konfigurieren:
-- =====================================================
-- Authentication → Providers → Email → "Confirm email" = ON
-- Authentication → Policies → Password Strength: min 10, leaked-password protection ON
-- Authentication → URL Configuration → Site URL = https://artcyc.vercel.app
-- Authentication → Rate Limits: Login-Attempts strenger setzen falls gewünscht
-- Authentication → MFA → Enable TOTP
