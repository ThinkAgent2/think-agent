-- ===========================================
-- NETTOYAGE FINAL
-- ===========================================
-- À exécuter APRÈS avoir vérifié que tout est OK
-- ===========================================

-- Supprimer l'ancienne colonne
ALTER TABLE challenges DROP COLUMN IF EXISTS marque;

-- Vérification finale
SELECT 
  niveau_associe,
  titre,
  marques,
  CASE 
    WHEN marques = '[]'::jsonb THEN 'Transverse'
    ELSE marques::text
  END as affichage
FROM challenges 
ORDER BY niveau_associe, titre;
