-- ===========================================
-- Migration: Allow deleting own ideas
-- Date: 2026-02-17
-- ===========================================

CREATE POLICY "Ideas suppression ouverte" ON idea_proposals FOR DELETE USING (true);
