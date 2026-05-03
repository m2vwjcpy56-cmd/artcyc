-- =====================================================
-- Trainings-Tracker: Datenbank einrichten
-- =====================================================

-- Sportler & Teams
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'athlete',
  notes TEXT DEFAULT '',
  email TEXT DEFAULT '',
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_status TEXT DEFAULT 'none',
  invited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Übungen
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  category_mode INT DEFAULT 2,
  third_category_label TEXT,
  default_series_count INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trainings-Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Einzelne Serien
CREATE TABLE series_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  series_index INT NOT NULL,
  result_status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Einstellungen
CREATE TABLE app_settings (
  id INT PRIMARY KEY DEFAULT 1,
  default_third_label TEXT DEFAULT 'Unsicher',
  default_series_count INT DEFAULT 10,
  CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO app_settings (id) VALUES (1);

-- Benutzer-Profile (verknüpft mit Login)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'athlete',
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security aktivieren
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all" ON athletes       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON exercises      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON sessions       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON series_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON app_settings   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_read" ON profiles      FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_own"  ON profiles      FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Erster User wird automatisch Admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE is_first BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) INTO is_first;
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    CASE WHEN is_first THEN 'admin' ELSE 'athlete' END,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
