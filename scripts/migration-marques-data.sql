-- ===========================================
-- RÉAFFECTATION DES MARQUES PAR CHALLENGE
-- ===========================================
-- À exécuter APRÈS migration-marques.sql
-- Convention : [] = transverse (toutes marques)
-- ===========================================

-- =====================
-- EXPLORER
-- =====================

-- Transverses
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Les Basiques du Prompting';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Gardien des Données';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Prompt Maestro';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Podcast Running';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'L''Ethnographe des Machines';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Mon Premier Agent n8n - Gestionnaire de Tâches';

-- IT + VALUE
UPDATE challenges SET marques = '["IT", "VALUE"]'::jsonb WHERE titre = 'La Boucle Ralph Wiggum';

-- FLOW
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Explorateur d''Idées (Design Ideation)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Persona Generator';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Sculpteur de Cibles (Personas)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'User Story Machine';

-- =====================
-- CRAFTER
-- =====================

-- Transverses
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Analyste Feedbacks';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Formation Express avec NotebookLM';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'L''Analyste de Réseau (LinkedIn Chat)';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'L''Expert GEO';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'L''Intégrateur de Contexte (Collaboration Dust)';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Concierge Connecté';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Conseiller McKinsey';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Data Storyteller';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Maître de la Présentation (Gamma Workflow)';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Sparring Partner';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Use Case Factory';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Veille Augmentée';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Vibe Coding Sécurisé';

-- FLOW seul
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Agent Backlog PO';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Assistant Scrum Master';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Brand Voice Designer';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Discovery Interview Copilot';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Entretien → Parcours';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Architecte de Content System';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Architecte de Structure (PRD & Objets Métiers)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Architecte de Vision (Vision Board)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Expert Identité Visuelle';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Oreille du Builder (Brief Listening)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'La BD dont vous êtes le PO';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Backlog Prioritizer';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Chief Question Officer (CQO)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Cloneur de Patterns (Mobbin Reference)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Consultant Stratégique Interne (NotebookLM RSS)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Designer de Précision (UX Pilot)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Magicien des OKRs (Tability AI)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Maître du Brief (Audio to Text)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le PM Power User (Claude Code Commands)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le System Thinker (Design Meaningful)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Mood Board 2026';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'PRD Manager';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Prototype Augmenté';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Spec Writer Pro';

-- FLOW + IT
UPDATE challenges SET marques = '["FLOW", "IT"]'::jsonb WHERE titre = 'Design System Documenter';
UPDATE challenges SET marques = '["FLOW", "IT"]'::jsonb WHERE titre = 'L''Artisan du Détail (Animated UI)';
UPDATE challenges SET marques = '["FLOW", "IT"]'::jsonb WHERE titre = 'Le Documentaliste de Vélocité (Storybook-Cursor)';

-- IT seul
UPDATE challenges SET marques = '["IT"]'::jsonb WHERE titre = 'Le Changelog Automatique';

-- IT + SHIELD
UPDATE challenges SET marques = '["IT", "SHIELD"]'::jsonb WHERE titre = 'La QA Augmentée';

-- VALUE seul
UPDATE challenges SET marques = '["VALUE"]'::jsonb WHERE titre = 'Le Pipeline Builder';

-- VALUE + IT
UPDATE challenges SET marques = '["VALUE", "IT"]'::jsonb WHERE titre = 'L''Explorateur de Données (Browser as API)';

-- SHIELD seul
UPDATE challenges SET marques = '["SHIELD"]'::jsonb WHERE titre = 'L''Auditeur GRC Augmenté';
UPDATE challenges SET marques = '["SHIELD"]'::jsonb WHERE titre = 'Le Coffre-Fort';
UPDATE challenges SET marques = '["SHIELD"]'::jsonb WHERE titre = 'Le Phishing Simulator';

-- FI seul
UPDATE challenges SET marques = '["FI"]'::jsonb WHERE titre = 'Le Traducteur Quant';

-- FI + SHIELD
UPDATE challenges SET marques = '["FI", "SHIELD"]'::jsonb WHERE titre = 'Le Regulatory Watch';

-- NILO seul
UPDATE challenges SET marques = '["NILO"]'::jsonb WHERE titre = 'L''Assistant Éco-Conception';

-- FLOW + NILO
UPDATE challenges SET marques = '["FLOW", "NILO"]'::jsonb WHERE titre = 'Le Simulateur Lean';

-- =====================
-- ARCHITECTE
-- =====================

-- Transverses
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'L''Employé Numérique';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'La Squad Virtuelle';
UPDATE challenges SET marques = '[]'::jsonb WHERE titre = 'Le Networker Intelligent';

-- IT seul (Boss Final après suppression doublon)
UPDATE challenges SET marques = '["IT"]'::jsonb WHERE titre = 'AgCraft - Boss Final';

-- FLOW seul
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Agilité Augmentée';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'L''Architecte de l''Obeya (Transversal Sync)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Créateur d''Univers (Marketing Créatif)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Product Builder Ultime (Navigator of Uncertainty)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Sociologue Digital';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Le Vibe Designer (Building live in Claude)';
UPDATE challenges SET marques = '["FLOW"]'::jsonb WHERE titre = 'Product Ops Command Center';

-- FLOW + IT
UPDATE challenges SET marques = '["FLOW", "IT"]'::jsonb WHERE titre = 'L''Ingénieur du Handoff (Figma Sync)';
UPDATE challenges SET marques = '["FLOW", "IT"]'::jsonb WHERE titre = 'La Triade de Livraison (Agentic Delivery Cycle)';

-- FLOW + VALUE
UPDATE challenges SET marques = '["FLOW", "VALUE"]'::jsonb WHERE titre = 'Le Product System';

-- FLOW + SHIELD
UPDATE challenges SET marques = '["FLOW", "SHIELD"]'::jsonb WHERE titre = 'Le Protecteur de l''Agence Utilisateur (Ethical AI UX)';

-- VALUE seul
UPDATE challenges SET marques = '["VALUE"]'::jsonb WHERE titre = 'Knowledge Graph Architect';
UPDATE challenges SET marques = '["VALUE"]'::jsonb WHERE titre = 'L''Expert en Inférence (Real-Time Symbiote)';
UPDATE challenges SET marques = '["VALUE"]'::jsonb WHERE titre = 'Le ML Experimenter';

-- VALUE + IT
UPDATE challenges SET marques = '["VALUE", "IT"]'::jsonb WHERE titre = 'Automated Platform Manager';
UPDATE challenges SET marques = '["VALUE", "IT"]'::jsonb WHERE titre = 'L''Architecte d''Intention (Computer Use)';
UPDATE challenges SET marques = '["VALUE", "IT"]'::jsonb WHERE titre = 'Le Superviseur de Code (Direction Value)';

-- VALUE + IT + FORGE
UPDATE challenges SET marques = '["VALUE", "IT", "FORGE"]'::jsonb WHERE titre = 'L''Architecte de Systèmes Souverains';

-- VALUE + FORGE
UPDATE challenges SET marques = '["VALUE", "FORGE"]'::jsonb WHERE titre = 'Modèle en Local';

-- VALUE + NILO
UPDATE challenges SET marques = '["VALUE", "NILO"]'::jsonb WHERE titre = 'Le Jumeau Numérique';

-- FORGE seul
UPDATE challenges SET marques = '["FORGE"]'::jsonb WHERE titre = 'Auditeur FinOps';

-- SHIELD seul
UPDATE challenges SET marques = '["SHIELD"]'::jsonb WHERE titre = 'Audit Sécurité Agents';
UPDATE challenges SET marques = '["SHIELD"]'::jsonb WHERE titre = 'Le Gardien du Système (Direction Shield)';

-- FI seul
UPDATE challenges SET marques = '["FI"]'::jsonb WHERE titre = 'L''Analyste de Flux (Direction Fi)';
UPDATE challenges SET marques = '["FI"]'::jsonb WHERE titre = 'Le Trading Desk Virtuel';

-- FI + SHIELD
UPDATE challenges SET marques = '["FI", "SHIELD"]'::jsonb WHERE titre = 'Le Conformity Guardian';

-- NILO seul
UPDATE challenges SET marques = '["NILO"]'::jsonb WHERE titre = 'L''Ingénieur Durable';

-- ===========================================
-- VÉRIFICATION
-- ===========================================
-- Exécuter après pour vérifier :
-- SELECT titre, marque, marques FROM challenges ORDER BY niveau_associe, titre;
