-- =====================================================
-- Feedback verknüpfen: Theresa Klopfer
-- -----------------------------------------------------
-- Das importierte Forms-Feedback (siehe feedback-import-seed.sql) hängt am
-- synthetischen Import-Athleten md5('fbath:Theresa Klopfer'), NICHT an ihrem
-- echten Konto (mit Login). Deshalb sieht sie es selbst nicht.
--
-- Diese Datei hängt ihr Feedback auf ihr ECHTES Konto um. Sie läuft im Seed-
-- Lauf der CI alphabetisch NACH feedback-import-seed.sql, ist idempotent
-- (der Import löscht/erzeugt das Platzhalter-Feedback bei jedem Lauf neu,
-- danach hängen wir es wieder um) und no-op, falls ihr Konto noch fehlt.
-- =====================================================
DO $$
DECLARE
  synth_id UUID := md5('fbath:Theresa Klopfer')::uuid;
  real_id  UUID;
  moved    INT;
BEGIN
  -- Echtes Konto: hat einen Login (auth_user_id) und passt namentlich.
  SELECT id INTO real_id
    FROM athletes
   WHERE auth_user_id IS NOT NULL
     AND id <> synth_id
     AND (
          lower(coalesce(name,'') || ' ' || coalesce(last_name,'')) LIKE '%theresa%klopfer%'
       OR lower(coalesce(name,'')) LIKE '%theresa%klopfer%'
       OR (lower(coalesce(name,'')) LIKE '%theresa%' AND lower(coalesce(last_name,'')) LIKE '%klopfer%')
     )
   ORDER BY created_at ASC
   LIMIT 1;

  IF real_id IS NULL THEN
    RAISE NOTICE 'Theresa Klopfer (echtes Konto) nicht gefunden — Feedback bleibt am Import-Platzhalter, skip.';
    RETURN;
  END IF;

  UPDATE feedback_entries
     SET athlete_id = real_id
   WHERE athlete_id = synth_id;
  GET DIAGNOSTICS moved = ROW_COUNT;

  RAISE NOTICE 'Theresa-Feedback umgehaengt: % Eintraege auf Konto %.', moved, real_id;
END $$;
