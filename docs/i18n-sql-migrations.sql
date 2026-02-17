-- =============================================
-- i18n Database Migrations for ThinkAgent
-- =============================================
-- 
-- Ces commandes doivent être exécutées manuellement dans Supabase Dashboard
-- car l'API REST ne supporte pas les commandes ALTER TABLE directement.
--
-- Accès : https://supabase.com/dashboard → Projet ThinkAgent → SQL Editor
--
-- =============================================

-- =============================================
-- 1. CHALLENGES - Ajouter les colonnes EN
-- =============================================

ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS titre_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS criteres_evaluation_en TEXT,
ADD COLUMN IF NOT EXISTS vision_impact_en TEXT,
ADD COLUMN IF NOT EXISTS le_saviez_vous_en TEXT;

-- Optionnel : Ajouter des commentaires pour la documentation
COMMENT ON COLUMN challenges.titre_en IS 'English title for the challenge';
COMMENT ON COLUMN challenges.description_en IS 'English description';
COMMENT ON COLUMN challenges.criteres_evaluation_en IS 'English evaluation criteria';
COMMENT ON COLUMN challenges.vision_impact_en IS 'English vision & impact text';
COMMENT ON COLUMN challenges.le_saviez_vous_en IS 'English "Did you know?" text';

-- =============================================
-- 2. BADGES - Ajouter les colonnes EN
-- =============================================

ALTER TABLE badges
ADD COLUMN IF NOT EXISTS nom_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMENT ON COLUMN badges.nom_en IS 'English badge name';
COMMENT ON COLUMN badges.description_en IS 'English badge description';

-- =============================================
-- 3. EVENEMENTS_DOJO - Ajouter les colonnes EN
-- =============================================

ALTER TABLE evenements_dojo
ADD COLUMN IF NOT EXISTS titre_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMENT ON COLUMN evenements_dojo.titre_en IS 'English event title';
COMMENT ON COLUMN evenements_dojo.description_en IS 'English event description';

-- =============================================
-- Vérification (après exécution)
-- =============================================

-- Vérifier les colonnes challenges
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'challenges' 
AND column_name LIKE '%_en';

-- Vérifier les colonnes badges
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'badges' 
AND column_name LIKE '%_en';

-- Vérifier les colonnes evenements_dojo
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'evenements_dojo' 
AND column_name LIKE '%_en';
