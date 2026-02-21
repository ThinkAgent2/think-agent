-- Progression system fields and tables

-- Enums
DO $$ BEGIN
  CREATE TYPE league_tier AS ENUM ('Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Master');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users fields
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS xp_global INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level_global INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS xp_weekly INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS explorer_completed_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS crafter_completed_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS architect_completed_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS selected_badge_primary UUID REFERENCES badges(id),
  ADD COLUMN IF NOT EXISTS selected_badge_secondary UUID REFERENCES badges(id),
  ADD COLUMN IF NOT EXISTS selected_title TEXT,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE,
  ADD COLUMN IF NOT EXISTS league league_tier DEFAULT 'Bronze';

-- Badges tables (if not already)
ALTER TABLE badges
  ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common',
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS condition_json JSONB DEFAULT '{}'::jsonb;

ALTER TABLE user_badges
  ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_league ON users(league);
CREATE INDEX IF NOT EXISTS idx_users_xp_weekly ON users(xp_weekly);
CREATE INDEX IF NOT EXISTS idx_users_xp_global ON users(xp_global);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
