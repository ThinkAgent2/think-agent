-- Ensure new badge fields exist
ALTER TABLE badges
  ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common',
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS condition_json JSONB DEFAULT '{}'::jsonb;

ALTER TABLE user_badges
  ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ DEFAULT NOW();

-- Seed rarity/icon based on existing badges
UPDATE badges SET rarity = 'common', icon = emoji WHERE rarity IS NULL;
