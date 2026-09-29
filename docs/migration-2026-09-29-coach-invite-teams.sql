-- 2026-09-29: Trainer-Einladung auch fuer Teams und selbst angelegte Sportler.
--
-- Vorher liess generate_coach_invite nur den EIGENEN Sportler (auth_user_id = ich)
-- oder Admins zu. Ein Team hat keinen eigenen Login (auth_user_id NULL, dafuer
-- created_by_coach_id) — jeder normale Team-Ersteller bekam deshalb
-- „Du darfst keinen Code fuer diesen Sportler generieren". Bis dahin war noch nie
-- eine Trainer-Einladung fuer ein Team entstanden; bei Ruben ging es nur als Admin.
--
-- Jetzt gilt dieselbe Regel wie beim Bearbeiten/Loeschen von Sessions:
-- can_manage_athlete = eigener Sportler, selbst angelegter Sportler/Team ohne Login,
-- Co-Trainer mit Admin-Recht, oder Admin.
--
-- Geprueft (Transaktion mit ROLLBACK): Simon als Team-Ersteller bekommt einen Code,
-- eine fremde Nutzerin wird weiter abgewiesen. Bereits eingespielt per Management-API.
-- Nicht als *-setup.sql benannt, damit der Deploy-Workflow sie nicht erneut ausfuehrt.
CREATE OR REPLACE FUNCTION public.generate_coach_invite(target_athlete_id uuid, label_text text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ DECLARE new_code TEXT; result JSONB; tries INT := 0; BEGIN IF NOT can_manage_athlete(target_athlete_id) THEN RAISE EXCEPTION 'Du darfst keinen Code fuer diesen Sportler generieren'; END IF; LOOP new_code := generate_claim_code(); EXIT WHEN NOT EXISTS (SELECT 1 FROM coach_invites WHERE claim_code = new_code) AND NOT EXISTS (SELECT 1 FROM athletes WHERE claim_code = new_code); tries := tries + 1; IF tries > 20 THEN RAISE EXCEPTION 'Konnte keinen eindeutigen Code generieren'; END IF; END LOOP; INSERT INTO coach_invites (athlete_id, claim_code, label) VALUES (target_athlete_id, new_code, label_text) RETURNING jsonb_build_object('id', id, 'claim_code', claim_code, 'label', label, 'rotated_at', claim_code_rotated_at) INTO result; RETURN result; END; $function$
;
