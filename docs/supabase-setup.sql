-- =====================================================
-- ArtCyc Coach — Supabase Schema
-- (idempotent; CI re-run 2026-06-16 nach transientem 503)
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
  last_name TEXT,
  license_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Nachträglich für bestehende DBs (idempotent).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_no TEXT;

-- =====================================================
-- 2) ATHLETES — kann mit/ohne User-Account existieren
-- =====================================================
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,            -- Vorname (bei Einzel) bzw. Teamname
  last_name TEXT DEFAULT '',     -- Nachname (leer bei Teams)
  type TEXT NOT NULL DEFAULT 'athlete', -- 'athlete' | 'team'
  discipline TEXT DEFAULT '',    -- nur bei Teams: '2er' | '4er' | '6er' (Formation)
  notes TEXT DEFAULT '',         -- Verein
  email TEXT DEFAULT '',
  -- User-Verknüpfung (NULL = vom Trainer ohne Account angelegt)
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Trainer der diesen Sportler angelegt hat (NULL = selbst registrierter Sportler)
  created_by_coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Claim-Code (6-stellig) zum Verknüpfen mit eigenem Account
  claim_code TEXT UNIQUE,
  claim_code_used_at TIMESTAMPTZ,
  -- Bei Team-Subjekten: Mehrfach-Beitritts-Code (Sportler treten per Code bei)
  join_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Eindeutigkeit: ein User kann max. einen athlete-Eintrag mit auth_user_id haben (vermeidet Doppel-Sportler)
  CONSTRAINT athletes_unique_user UNIQUE (auth_user_id)
);
CREATE INDEX IF NOT EXISTS athletes_coach_idx ON athletes(created_by_coach_id) WHERE created_by_coach_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS athletes_user_idx ON athletes(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS athletes_claim_idx ON athletes(claim_code) WHERE claim_code IS NOT NULL;
-- Nachträglich für bestehende DBs: Nachname-Spalte ergänzen (idempotent).
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '';
-- Formation für Team-Subjekte ('2er'|'4er'|'6er').
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS discipline TEXT DEFAULT '';
-- Beitritts-Code für Team-Subjekte (mehrfach nutzbar).
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS join_code TEXT;

-- =====================================================
-- 2b) TEAM_MEMBERS — verknüpft Accounts (Sportler) mit Team-Subjekten.
--     Ein Team ist eine athletes-Zeile mit type='team'. Mitglieder sind
--     athletes-Zeilen mit auth_user_id (= echte Accounts). So teilen alle
--     Mitglieder dieselben Team-Daten (Sessions/Wettkämpfe), während
--     Einzeldaten (1er) privat bleiben.
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  team_id    UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,  -- type='team'
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,  -- Mitglied (mit Account)
  role       TEXT NOT NULL DEFAULT 'member',  -- 'captain' | 'member'
  added_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, athlete_id)
);
CREATE INDEX IF NOT EXISTS team_members_team_idx ON team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_athlete_idx ON team_members(athlete_id);

-- Sicherstellen, dass athlete_coaches existiert (Multi-Coach, Phase 11). Wird
-- hier referenziert (coaches_team_member). In Produktion längst vorhanden;
-- IF NOT EXISTS macht das Basis-Setup self-contained. RLS/Policies dieser
-- Tabelle bleiben aus der Phase-11-Migration unangetastet.
CREATE TABLE IF NOT EXISTS athlete_coaches (
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  coach_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (athlete_id, coach_id)
);

-- =====================================================
-- 2c) CLUBS — selbstlernende Vereinsliste (Crowdsource).
--     Von Nutzern eingegebene Vereine werden gesammelt; ab genügend
--     Nennungen (usage_count) erscheinen sie als Vorschlag für alle.
--     name_norm = normalisiert (Dedup). country/source ggf. später per KI.
-- =====================================================
CREATE TABLE IF NOT EXISTS clubs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,                  -- Anzeige-Schreibweise
  name_norm   TEXT NOT NULL UNIQUE,           -- normalisiert (Dedup-Schlüssel)
  country     TEXT DEFAULT '',
  source      TEXT NOT NULL DEFAULT 'user',   -- 'user' | 'curated' | 'ai'
  usage_count INT  NOT NULL DEFAULT 1,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS clubs_usage_idx ON clubs(usage_count DESC);

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
-- 6b) FEEDBACK_ENTRIES — Coaching-Feedback pro Übung (+ Sportler/Team).
--     Felder spiegeln den bisherigen Forms/Excel-Prozess. Sichtbarkeit über
--     can_access_athlete() → erbt Eigen-/Trainer-/Team-Sicht automatisch.
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  exercise_ref      TEXT,                 -- exercise.id im App-Datenmodell
  exercise_name     TEXT DEFAULT '',
  exercise_code     TEXT DEFAULT '',      -- uci_code (für Matching)
  fehlerbild        TEXT DEFAULT '',      -- Was stimmt nicht?
  handlungsanweisung TEXT DEFAULT '',     -- Worauf achten?
  context           TEXT DEFAULT '',      -- Heimtraining / Lehrgang …
  given_by          TEXT DEFAULT '',      -- Heimtrainer / Lehrgangsleiter / Sportler
  feedback_type     TEXT DEFAULT '',      -- verbale Korrektur / Video / Dartfish
  dartfish_url      TEXT DEFAULT '',
  helpful           INT,                  -- 1..4
  r_technik         INT,
  r_ausfuehrung     INT,
  r_fortschritt     INT,
  r_programm        INT,
  r_wettkampf       INT,
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS feedback_athlete_idx ON feedback_entries(athlete_id);

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

-- Bin ich (eingeloggter User) Mitglied dieses Team-Subjekts?
CREATE OR REPLACE FUNCTION is_team_member(team_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_members tm
    JOIN athletes me ON me.id = tm.athlete_id
    WHERE tm.team_id = team_uuid AND me.auth_user_id = auth.uid()
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Verwalte ich dieses Team (Ersteller oder Admin)?
CREATE OR REPLACE FUNCTION manages_team(team_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = team_uuid
      AND type = 'team'
      AND (created_by_coach_id = auth.uid() OR is_admin())
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Ist dieser Athlete über eine gemeinsame Team-Mitgliedschaft sichtbar?
-- (= das Subjekt ist ein Team, in dem ich Mitglied bin, ODER es ist ein
--  Team-Kollege aus einem meiner Teams.) Nur für Namens-/Roster-Anzeige —
--  Einzeldaten bleiben über can_access_athlete privat.
CREATE OR REPLACE FUNCTION visible_via_team(athlete_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT
    is_team_member(athlete_uuid)
    OR EXISTS (
      SELECT 1
      FROM team_members tmem
      JOIN team_members tmine ON tmine.team_id = tmem.team_id
      JOIN athletes me ON me.id = tmine.athlete_id
      WHERE tmem.athlete_id = athlete_uuid
        AND me.auth_user_id = auth.uid()
    )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Bin ich Trainer:in mindestens eines Mitglieds dieses Teams?
-- (über created_by_coach_id ODER die Multi-Coach-Tabelle athlete_coaches.)
-- So sieht ein Trainer auch Teams, die ein Sportler selbst angelegt hat.
CREATE OR REPLACE FUNCTION coaches_team_member(team_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM team_members tm
    JOIN athletes a ON a.id = tm.athlete_id
    WHERE tm.team_id = team_uuid
      AND (
        a.created_by_coach_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM athlete_coaches ac
          WHERE ac.athlete_id = a.id AND ac.coach_id = auth.uid()
        )
      )
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Ist ein bestimmter Athlete für mich sichtbar/editierbar?
-- Eigener Eintrag, von mir betreuter Sportler, Admin — ODER ein Team-Subjekt,
-- in dem ich Mitglied bin bzw. dessen Mitglied ich trainiere (dann darf ich die
-- geteilten Team-Daten lesen/schreiben).
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
  ) OR is_team_member(athlete_uuid)
    OR coaches_team_member(athlete_uuid)
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

-- Team-Beitritt per Code: fügt den eigenen Athleten-Eintrag als Mitglied hinzu.
-- SECURITY DEFINER, damit der Self-Join die team_members-Insert-Policy
-- (nur Verwalter) gezielt umgehen darf — Berechtigung = gültiger Code.
CREATE OR REPLACE FUNCTION join_team(input_code TEXT)
RETURNS UUID AS $$
DECLARE
  team_uuid UUID;
  my_athlete UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Nicht angemeldet';
  END IF;
  SELECT id INTO team_uuid FROM athletes
   WHERE type = 'team'
     AND join_code IS NOT NULL
     AND join_code = upper(replace(replace(input_code, ' ', ''), '-', ''))
   LIMIT 1;
  IF team_uuid IS NULL THEN
    RAISE EXCEPTION 'Team-Code ungültig';
  END IF;
  SELECT id INTO my_athlete FROM athletes WHERE auth_user_id = auth.uid() LIMIT 1;
  IF my_athlete IS NULL THEN
    RAISE EXCEPTION 'Kein Sportler-Profil vorhanden';
  END IF;
  INSERT INTO team_members (team_id, athlete_id, role, added_by)
  VALUES (team_uuid, my_athlete, 'member', auth.uid())
  ON CONFLICT (team_id, athlete_id) DO NOTHING;
  RETURN team_uuid;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- (Re)Generiert den Beitritts-Code eines Teams. Nur Verwalter/Admin.
CREATE OR REPLACE FUNCTION regenerate_team_join_code(team_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  IF NOT manages_team(team_uuid) THEN
    RAISE EXCEPTION 'Keine Berechtigung';
  END IF;
  code := generate_claim_code();
  UPDATE athletes SET join_code = code WHERE id = team_uuid;
  RETURN code;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- Verein registrieren (Crowdsource): legt einen neuen Verein an oder erhöht
-- den Zähler eines bestehenden (Dedup über name_norm). Gibt die kanonische
-- Anzeige-Schreibweise zurück. SECURITY DEFINER, damit clubs ohne direkte
-- Schreibrechte gepflegt werden kann.
CREATE OR REPLACE FUNCTION register_club(p_name TEXT, p_norm TEXT, p_country TEXT DEFAULT '')
RETURNS TEXT AS $$
DECLARE
  canonical TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  p_name := trim(p_name);
  IF p_name = '' OR coalesce(trim(p_norm), '') = '' THEN RETURN NULL; END IF;

  INSERT INTO clubs (name, name_norm, country, source, created_by)
  VALUES (p_name, p_norm, coalesce(p_country, ''), 'user', auth.uid())
  ON CONFLICT (name_norm)
    DO UPDATE SET usage_count = clubs.usage_count + 1
  RETURNING name INTO canonical;

  RETURN canonical;
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

  INSERT INTO public.profiles (id, role, display_name, last_name)
  VALUES (
    NEW.id,
    chosen_role,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'last_name', '')
  );

  -- Wenn Rolle 'athlete' ODER 'admin' (Admin trainiert ja auch ggf. selbst): Athlete-Eintrag automatisch
  -- Coaches starten mit leerer Liste
  IF chosen_role IN ('athlete', 'admin') THEN
    INSERT INTO public.athletes (name, last_name, auth_user_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'last_name', ''), ''),
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
  -- Eigenes Profil aenderbar. Admins duerfen auch ihr (Admin-)Profil aendern;
  -- Nicht-Admins koennen sich nicht selbst auf 'admin' hochstufen.
  WITH CHECK (id = auth.uid() AND (is_admin() OR role IN ('athlete', 'coach')));
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
    OR visible_via_team(id)          -- Team-Subjekte + Team-Kollegen (Namen/Roster)
    OR coaches_team_member(id)       -- Trainer eines Mitglieds sieht das Team
  );
-- Anlegen: Coach/Admin legen Sportler an (Sportler-Self via Trigger);
-- Team-Subjekte (type='team') darf jeder Account anlegen (created_by = ich).
CREATE POLICY athletes_insert ON athletes
  FOR INSERT TO authenticated
  WITH CHECK (
    (is_coach() AND created_by_coach_id = auth.uid())
    OR (type = 'team' AND created_by_coach_id = auth.uid())
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

-- TEAM_MEMBERS: sichtbar für Mitglieder + Team-Verwalter; verwalten nur der
-- Ersteller/Admin des Teams.
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS team_members_select ON team_members;
DROP POLICY IF EXISTS team_members_insert ON team_members;
DROP POLICY IF EXISTS team_members_update ON team_members;
DROP POLICY IF EXISTS team_members_delete ON team_members;

CREATE POLICY team_members_select ON team_members
  FOR SELECT TO authenticated
  USING (is_team_member(team_id) OR manages_team(team_id) OR coaches_team_member(team_id));
CREATE POLICY team_members_insert ON team_members
  FOR INSERT TO authenticated
  WITH CHECK (manages_team(team_id));
CREATE POLICY team_members_update ON team_members
  FOR UPDATE TO authenticated
  USING (manages_team(team_id))
  WITH CHECK (manages_team(team_id));
CREATE POLICY team_members_delete ON team_members
  FOR DELETE TO authenticated
  USING (manages_team(team_id));

-- FEEDBACK_ENTRIES: sichtbar/schreibbar wenn der zugehörige Athlet (oder das
-- Team) für mich zugänglich ist — gleiche Logik wie Sessions/Wettkämpfe.
ALTER TABLE feedback_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS feedback_select ON feedback_entries;
DROP POLICY IF EXISTS feedback_write ON feedback_entries;
CREATE POLICY feedback_select ON feedback_entries
  FOR SELECT TO authenticated
  USING (can_access_athlete(athlete_id));
CREATE POLICY feedback_write ON feedback_entries
  FOR ALL TO authenticated
  USING (can_access_athlete(athlete_id))
  WITH CHECK (can_access_athlete(athlete_id));

-- CLUBS: alle Authenticated dürfen lesen (Vorschläge). Schreiben nur über die
-- SECURITY-DEFINER-RPC register_club() — keine direkten Insert/Update-Policies.
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS clubs_select ON clubs;
CREATE POLICY clubs_select ON clubs
  FOR SELECT TO authenticated
  USING (true);

-- =====================================================
-- 10) FERTIG. Im Supabase-Dashboard noch konfigurieren:
-- =====================================================
-- Authentication → Providers → Email → "Confirm email" = ON
-- Authentication → Policies → Password Strength: min 10, leaked-password protection ON
-- Authentication → URL Configuration → Site URL = https://artcyc.vercel.app
-- Authentication → Rate Limits: Login-Attempts strenger setzen falls gewünscht
-- Authentication → MFA → Enable TOTP
