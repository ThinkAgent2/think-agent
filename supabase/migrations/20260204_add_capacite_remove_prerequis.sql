-- ===========================================
-- Migration: Add capacite to evenements_dojo, remove prerequis from challenges
-- Date: 2026-02-04
-- ===========================================

-- 1. Ajouter le champ capacite à evenements_dojo
ALTER TABLE evenements_dojo 
ADD COLUMN IF NOT EXISTS capacite INTEGER DEFAULT 15;

-- 2. Supprimer le champ prerequis de challenges (plus de verrouillage)
ALTER TABLE challenges 
DROP COLUMN IF EXISTS prerequis;

-- 3. Mettre à jour les événements existants avec une capacité par défaut
UPDATE evenements_dojo 
SET capacite = 15 
WHERE capacite IS NULL;

-- Vérification
COMMENT ON COLUMN evenements_dojo.capacite IS 'Nombre maximum de participants au Dojo (10-15 typiquement)';
