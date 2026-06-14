-- =====================================================
-- Migration Phase 12 — Admin-Sicht + Code-Trainer-Zugriff
-- =====================================================
-- In Supabase → SQL Editor ausführen (idempotent, mehrfach gefahrlos).
--
-- (1) App-Owner ist immer Admin (profiles.role='admin') — sofort gesetzt und
--     per Trigger dauerhaft erzwungen, damit die Admin-Sicht nicht wieder
--     verloren geht. Owner = feste IDs/E-Mails (Spiegel von src/lib/supabase.js).
-- (2) can_access_athlete() berücksichtigt jetzt auch die Code-Verknüpfung
--     (athlete_coaches), nicht nur den Haupt-Trainer (created_by_coach_id).
--     So sehen per Code verbundene Trainer die Trainings/Wettkämpfe ihres
--     Sportlers (Sessions/Competitions hängen an dieser Funktion).
-- =====================================================

-- ---------- (1) Owner → Admin ----------

-- a) Sofort setzen
UPDATE public.profiles p
SET role = 'admin'
WHERE p.id = ANY (ARRAY['339bfe2b-e0c5-4a1b-8a94-d44d2c0cb3d4']::uuid[])
   OR lower((SELECT u.email FROM auth.users u WHERE u.id = p.id)) = ANY (
        ARRAY['felder-regenbogen9q@icloud.com', 'info@neue-weberei.de']
      );

-- b) Dauerhaft erzwingen (Insert/Update auf profiles)
CREATE OR REPLACE FUNCTION public.enforce_owner_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  owner_ids    uuid[] := ARRAY['339bfe2b-e0c5-4a1b-8a94-d44d2c0cb3d4']::uuid[];
  owner_emails text[] := ARRAY['felder-regenbogen9q@icloud.com', 'info@neue-weberei.de'];
  u_email      text;
BEGIN
  SELECT lower(email) INTO u_email FROM auth.users WHERE id = NEW.id;
  IF NEW.id = ANY (owner_ids)
     OR (u_email IS NOT NULL AND u_email = ANY (owner_emails)) THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_owner_admin ON public.profiles;
CREATE TRIGGER trg_enforce_owner_admin
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_owner_admin();

-- ---------- (2) Code-Trainer dürfen Sessions/Wettkämpfe sehen ----------

CREATE OR REPLACE FUNCTION public.can_access_athlete(athlete_uuid UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM athletes
    WHERE id = athlete_uuid
      AND (
        auth_user_id = auth.uid()
        OR created_by_coach_id = auth.uid()
        OR is_admin()
        OR EXISTS (
          SELECT 1 FROM athlete_coaches ac
          WHERE ac.athlete_id = athletes.id
            AND ac.coach_id = auth.uid()
        )
      )
  )
$$;
