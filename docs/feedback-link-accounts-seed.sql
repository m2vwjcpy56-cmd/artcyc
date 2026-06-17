-- =====================================================
-- Import-Platzhalter automatisch in echte Konten zusammenführen
-- -----------------------------------------------------
-- feedback-import-seed.sql legt für jeden Kader-Namen einen Platzhalter-Athleten
-- an (id = md5('fbath:'||name), ohne Login). Sobald die Person ein echtes Konto
-- hat, soll der Platzhalter verschwinden und seine Daten am echten Konto hängen.
--
-- Diese Datei läuft im Seed-Lauf alphabetisch NACH feedback-import-seed.sql und
-- ist idempotent: bei jedem Deploy werden alle Platzhalter, für die ein
-- gleichnamiges echtes Konto existiert, überführt (Feedback/Sessions/Wettkämpfe
-- umgehängt) und der Platzhalter gelöscht. So bleibt die Zusammenführung dauerhaft
-- bestehen, auch wenn der Import-Seed den Platzhalter erneut anlegt.
-- =====================================================
DO $$
DECLARE
  s     RECORD;
  t_id  UUID;
  moved INT;
BEGIN
  FOR s IN
    SELECT id, name FROM athletes
     WHERE auth_user_id IS NULL
       AND id = md5('fbath:' || name)::uuid     -- nur echte Import-Platzhalter
  LOOP
    -- Echtes Konto mit Login, gleicher (voller) Name.
    SELECT a.id INTO t_id FROM athletes a
     WHERE a.auth_user_id IS NOT NULL
       AND a.id <> s.id
       AND a.type <> 'team'
       AND (
            lower(btrim(coalesce(a.name,'') || ' ' || coalesce(a.last_name,''))) = lower(btrim(s.name))
         OR lower(btrim(coalesce(a.name,''))) = lower(btrim(s.name))
       )
     ORDER BY a.created_at ASC
     LIMIT 1;

    IF t_id IS NULL THEN CONTINUE; END IF;   -- noch kein echtes Konto → Platzhalter bleibt

    UPDATE feedback_entries SET athlete_id = t_id WHERE athlete_id = s.id;
    GET DIAGNOSTICS moved = ROW_COUNT;
    UPDATE sessions         SET athlete_id = t_id WHERE athlete_id = s.id;
    UPDATE competitions     SET athlete_id = t_id WHERE athlete_id = s.id;
    DELETE FROM team_members    WHERE athlete_id = s.id;
    DELETE FROM athlete_coaches WHERE athlete_id = s.id;
    DELETE FROM athletes WHERE id = s.id;

    RAISE NOTICE 'Platzhalter "%" auf Konto % zusammengefuehrt (% Feedbacks).', s.name, t_id, moved;
  END LOOP;
END $$;
