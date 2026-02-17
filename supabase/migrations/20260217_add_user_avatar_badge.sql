-- ===========================================
-- Migration: Add avatar + featured badge to users
-- Date: 2026-02-17
-- ===========================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS featured_badge_id UUID REFERENCES badges(id);
