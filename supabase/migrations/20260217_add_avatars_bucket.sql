-- ===========================================
-- Migration: Avatars bucket policies
-- Date: 2026-02-17
-- ===========================================

-- Create bucket (if not existing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies (public read, open write for now)
CREATE POLICY "Avatars visibles par tous" ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Avatars upload ouvert" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Avatars suppression ouverte" ON storage.objects FOR DELETE
USING (bucket_id = 'avatars');
