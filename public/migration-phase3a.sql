-- =====================================================
-- Phase 3a — User-Daten-Snapshot
-- =====================================================
-- Speichert die komplette App-Datenstruktur als JSONB pro User.
-- Einfach, robust, last-write-wins. Trainer-Features kommen
-- später als richtige Relational-Tabellen.

CREATE TABLE IF NOT EXISTS user_data_snapshots (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_data_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_data_select ON user_data_snapshots;
DROP POLICY IF EXISTS user_data_write  ON user_data_snapshots;

-- Jeder User sieht/schreibt nur eigenen Snapshot
CREATE POLICY user_data_select ON user_data_snapshots
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY user_data_write ON user_data_snapshots
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Auto-update updated_at bei Änderungen
CREATE OR REPLACE FUNCTION public.touch_user_data_snapshot()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_data_touch ON user_data_snapshots;
CREATE TRIGGER user_data_touch
  BEFORE UPDATE ON user_data_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.touch_user_data_snapshot();
