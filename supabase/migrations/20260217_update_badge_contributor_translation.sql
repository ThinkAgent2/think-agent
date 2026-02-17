-- ===========================================
-- Migration: Add English fields for Contributeur badge
-- Date: 2026-02-17
-- ===========================================

ALTER TABLE badges ADD COLUMN IF NOT EXISTS nom_en TEXT;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS description_en TEXT;

UPDATE badges
SET nom_en = 'Contributor',
    description_en = 'PR merged on the ThinkAgent repo'
WHERE nom = 'Contributeur';
