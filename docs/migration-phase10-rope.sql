-- =====================================================
-- Phase 10 — Mit/Ohne Seil pro Übung + Session
-- =====================================================
-- exercises.has_rope_variant: aktiviert beim Erfassen
--   den "Mit Seil / Ohne Seil"-Toggle (nur für Übungen
--   bei denen die Variante sinnvoll ist, z.B. Maute-Sprung)
-- sessions.with_rope: true=mit Seil, false=ohne Seil,
--   NULL=Übung hat keine Seil-Variante / nicht relevant
-- =====================================================

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS has_rope_variant BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS with_rope BOOLEAN;

-- =====================================================
-- Daten-Migration: bestehende Maute-Sprung-Übungen
-- markieren + alle bisherigen Sessions auf "Mit Seil"
-- setzen (User-Wunsch: bisher wurde mit Seil trainiert).
-- =====================================================

UPDATE public.exercises
SET has_rope_variant = true
WHERE lower(name) LIKE '%maute%'
  AND has_rope_variant = false;

UPDATE public.sessions s
SET with_rope = true
FROM public.exercises e
WHERE s.exercise_id = e.id
  AND lower(e.name) LIKE '%maute%'
  AND s.with_rope IS NULL;
