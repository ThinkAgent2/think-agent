-- ===========================================
-- Migration: Ideas module (proposals + votes)
-- Date: 2026-02-17
-- ===========================================

-- Types
CREATE TYPE idea_status AS ENUM ('Proposee', 'Validee', 'Refusee');
CREATE TYPE idea_theme AS ENUM (
  'correction_bug',
  'nouvelle_fonctionnalite',
  'amelioration_ui',
  'performance',
  'contenu',
  'autre'
);

-- Propositions d'idées
CREATE TABLE idea_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  auteur_id UUID REFERENCES users(id) ON DELETE SET NULL,
  themes idea_theme[] DEFAULT '{}',
  screenshots JSONB DEFAULT '[]',
  statut idea_status DEFAULT 'Proposee',
  github_username TEXT,
  validation_commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE idea_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES idea_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Index
CREATE INDEX idx_idea_proposals_status ON idea_proposals(statut);
CREATE INDEX idx_idea_votes_idea ON idea_votes(idea_id);

-- View: vote counts
CREATE OR REPLACE VIEW idea_vote_counts AS
SELECT idea_id, COUNT(*)::int AS votes
FROM idea_votes
GROUP BY idea_id;

-- RLS
ALTER TABLE idea_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ideas visibles par tous" ON idea_proposals FOR SELECT USING (true);
CREATE POLICY "Ideas creation ouverte" ON idea_proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Ideas modification ouverte" ON idea_proposals FOR UPDATE USING (true);

CREATE POLICY "Votes visibles par tous" ON idea_votes FOR SELECT USING (true);
CREATE POLICY "Votes creation ouverte" ON idea_votes FOR INSERT WITH CHECK (true);

-- Badge Contributeur (attribué manuellement après PR validée)
INSERT INTO badges (nom, description, emoji, conditions)
VALUES ('Contributeur', 'PR validée sur le repo ThinkAgent', '🧩', '{"pr_merged": true}')
ON CONFLICT (nom) DO NOTHING;

-- Trigger updated_at
CREATE TRIGGER idea_proposals_updated_at
  BEFORE UPDATE ON idea_proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
