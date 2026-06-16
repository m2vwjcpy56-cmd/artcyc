-- =====================================================
-- ArtCyc Coach — Migration: Nachname (last_name) in profiles
-- =====================================================
-- Idempotent — kann gefahrlos mehrfach laufen (CI wendet docs/*-setup.sql
-- bei jedem Deploy an).
--
-- Hintergrund: Im Registrierungsprozess wird jetzt zusätzlich ein Nachname
-- abgefragt. Angesprochen/angezeigt wird weiterhin nur der Vorname
-- (display_name); der Nachname liegt nur in den Daten.

-- 1) Spalte ergänzen
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- 2) Trigger erweitern: last_name aus den Signup-Metadaten übernehmen.
--    Rest der Funktion bleibt identisch zum Basis-Schema.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first BOOLEAN;
  chosen_role TEXT;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) INTO is_first;
  chosen_role := COALESCE(NEW.raw_user_meta_data->>'role', 'athlete');
  IF chosen_role NOT IN ('athlete', 'coach') THEN
    chosen_role := 'athlete';
  END IF;
  IF is_first THEN chosen_role := 'admin'; END IF;

  INSERT INTO public.profiles (id, role, display_name, last_name)
  VALUES (
    NEW.id,
    chosen_role,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'last_name', '')
  );

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
