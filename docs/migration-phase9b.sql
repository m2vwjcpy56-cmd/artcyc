-- =====================================================
-- Phase 9b — Bidirektionale Claim-Codes
-- =====================================================
-- Ersetzt das alte claim_athlete (das nur Athlet→Account-Verknüpfung
-- konnte) durch redeem_athlete_code, das beide Richtungen handhabt:
--
-- Richtung 1: Trainer hat Sportler ohne Account angelegt
--   - athletes-Row: auth_user_id IS NULL, created_by_coach_id = trainer
--   - Sportler signed up + tippt Code → claim setzt auth_user_id
--
-- Richtung 2: Sportler hat eigenen Account, gibt Trainer Zugriff
--   - athletes-Row: auth_user_id = sportler, created_by_coach_id IS NULL
--   - Trainer tippt Code → claim setzt created_by_coach_id

-- Alte Funktion löschen
DROP FUNCTION IF EXISTS public.claim_athlete(text);

CREATE OR REPLACE FUNCTION public.redeem_athlete_code(input_code TEXT)
RETURNS jsonb AS $$
DECLARE
  rec record;
  result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Nicht angemeldet';
  END IF;

  -- Code normalisieren: Großbuchstaben, Leerzeichen entfernen
  input_code := upper(replace(replace(input_code, ' ', ''), '-', ''));

  SELECT * INTO rec FROM public.athletes
   WHERE claim_code = input_code
     AND claim_code_used_at IS NULL
   LIMIT 1;

  IF rec IS NULL THEN
    RAISE EXCEPTION 'Code ungültig oder bereits eingelöst';
  END IF;

  -- Verhindern dass User seinen eigenen Code einlöst
  IF rec.auth_user_id = auth.uid() OR rec.created_by_coach_id = auth.uid() THEN
    RAISE EXCEPTION 'Du kannst deinen eigenen Code nicht einlösen';
  END IF;

  IF rec.auth_user_id IS NULL THEN
    -- Richtung 1: Sportler claimt einen Trainer-managed Eintrag
    -- Auto-merge: vom Signup-Trigger erstellten "eigenen" Eintrag löschen
    -- (nur wenn er noch keinem Trainer zugeordnet ist)
    DELETE FROM public.athletes
     WHERE auth_user_id = auth.uid()
       AND created_by_coach_id IS NULL
       AND id != rec.id;

    UPDATE public.athletes
       SET auth_user_id = auth.uid(),
           claim_code = NULL,
           claim_code_used_at = NOW()
     WHERE id = rec.id;
    result := jsonb_build_object(
      'athlete_id', rec.id,
      'athlete_name', rec.name,
      'role_granted', 'athlete'
    );

  ELSIF rec.created_by_coach_id IS NULL THEN
    -- Richtung 2: Trainer wird als Coach hinzugefügt
    IF NOT is_coach() THEN
      RAISE EXCEPTION 'Nur Trainer:innen können Sportler-Zugriff erhalten. Registriere dich als Trainer:in.';
    END IF;
    UPDATE public.athletes
       SET created_by_coach_id = auth.uid(),
           claim_code = NULL,
           claim_code_used_at = NOW()
     WHERE id = rec.id;
    result := jsonb_build_object(
      'athlete_id', rec.id,
      'athlete_name', rec.name,
      'role_granted', 'coach'
    );

  ELSE
    RAISE EXCEPTION 'Sportler ist bereits mit Account und Trainer verknüpft';
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
