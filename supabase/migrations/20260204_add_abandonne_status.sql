-- ===========================================
-- Migration: Add 'Abandonné' status to participation_status enum
-- Date: 2026-02-04
-- ===========================================

-- Ajouter la valeur 'Abandonné' à l'enum participation_status
ALTER TYPE participation_status ADD VALUE IF NOT EXISTS 'Abandonné';
