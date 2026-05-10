-- =====================================================
-- Phase 9c — Coach darf Snapshot der verknüpften Athleten lesen
-- =====================================================
-- Erweitert user_data_select-Policy so dass Coaches die Snapshots
-- ihrer verwalteten Sportler lesen können. Schreiben bleibt
-- ausschließlich beim Owner.

DROP POLICY IF EXISTS user_data_select ON user_data_snapshots;

CREATE POLICY user_data_select ON user_data_snapshots
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.athletes a
      WHERE a.auth_user_id = user_data_snapshots.user_id
        AND (a.created_by_coach_id = auth.uid() OR public.is_admin())
    )
  );

-- Write-Policy bleibt unverändert: nur Owner darf schreiben.
