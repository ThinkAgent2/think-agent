-- ===========================================
-- Migration: Update ideas themes to 3 options
-- Date: 2026-02-17
-- ===========================================

-- Replace enum values (Postgres doesn't support DROP VALUE)
ALTER TYPE idea_theme RENAME TO idea_theme_old;

CREATE TYPE idea_theme AS ENUM (
  'correction_bug',
  'nouvelle_fonctionnalite',
  'amelioration_ui'
);

ALTER TABLE idea_proposals
  ALTER COLUMN themes TYPE idea_theme[]
  USING ARRAY(
    SELECT unnest(themes)::text::idea_theme
  );

DROP TYPE idea_theme_old;
