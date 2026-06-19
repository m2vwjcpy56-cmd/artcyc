-- =====================================================
-- Fix: verwaiste Programme (owner_id IS NULL) beschreibbar machen
-- =====================================================
-- Problem: Ältere Programme wurden ohne owner_id angelegt (bevor das
-- Setzen von owner_id erzwungen wurde). Die bisherige Schreib-Policy
--   USING (owner_id = auth.uid() OR (owner_id IS NULL AND is_admin()))
-- verbietet Nicht-Admins jedes UPDATE/DELETE solcher Zeilen → der
-- Bereinigungs-/Merge-Lauf (und auch normales Bearbeiten) scheitert mit
--   "new row violates row-level security policy (USING expression)
--    for table programs".
--
-- Lösung: Authentifizierte Nutzer dürfen verwaiste (owner_id IS NULL)
-- Programme übernehmen — sie sind ohnehin global lesbar (programs_select),
-- und das WITH CHECK erzwingt, dass die Zeile danach dem Übernehmer gehört
-- (owner_id = auth.uid()). Es gibt — anders als bei exercises — keine
-- legitimen „globalen Programme", die schreibgeschützt bleiben müssten.
--
-- Idempotent (DROP IF EXISTS + CREATE) → bei jedem CI-Lauf gefahrlos.

DROP POLICY IF EXISTS programs_write ON public.programs;

CREATE POLICY programs_write ON public.programs
  FOR ALL TO authenticated
  USING (
    owner_id = auth.uid()
    OR owner_id IS NULL            -- verwaiste Zeilen übernehmbar
    OR public.is_admin()
  )
  WITH CHECK (
    owner_id = auth.uid()          -- nach dem Schreiben gehört sie mir
    OR (owner_id IS NULL AND public.is_admin())
  );
