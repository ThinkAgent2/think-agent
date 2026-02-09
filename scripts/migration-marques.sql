-- ===========================================
-- MIGRATION : marque (TEXT) → marques (JSONB)
-- ===========================================
-- À exécuter dans Supabase SQL Editor
-- Date : 2026-02-09
-- ===========================================

-- ÉTAPE 1 : Ajouter la nouvelle colonne
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS marques JSONB DEFAULT '[]';

-- ÉTAPE 2 : Migrer temporairement les données existantes (sera écrasé par l'étape 3)
UPDATE challenges 
SET marques = CASE 
  WHEN marque = 'Tous' OR marque IS NULL THEN '[]'::jsonb
  ELSE jsonb_build_array(marque)
END
WHERE marques = '[]'::jsonb OR marques IS NULL;

-- ÉTAPE 3 : Supprimer le doublon AgCraft (garder celui avec description complète)
DELETE FROM challenges 
WHERE titre = 'AgCraft (Boss Final) 🏆' 
  AND id = '3b204021-8068-4f01-b1be-89016d389e53';

-- ÉTAPE 4 : Appliquer la nouvelle répartition intelligente
-- (Exécuter le script suivant : migration-marques-data.sql)
