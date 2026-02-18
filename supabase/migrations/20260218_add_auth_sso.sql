-- ===========================================
-- Migration: Supabase Auth (Microsoft SSO)
-- Date: 2026-02-18
-- Draft: review before applying
-- ===========================================

-- 1) Link public.users to auth.users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

-- 2) Ensure emails are unique for upsert safety (adjust if already unique)
-- (If you already have a unique index, this is a no-op)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND indexname = 'users_email_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- 3) Auto-provision (or link) user on SSO signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (email, nom, auth_id)
  VALUES (
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.email
    ),
    NEW.id
  )
  ON CONFLICT (email)
  DO UPDATE SET auth_id = EXCLUDED.auth_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) RLS policies (tighten users table)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users peuvent modifier leur profil" ON users;
DROP POLICY IF EXISTS "Users peuvent créer leur profil" ON users;

CREATE POLICY "Users can select own profile"
  ON users FOR SELECT
  USING (auth_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth_id = auth.uid());

-- NOTE:
-- - Other tables currently have open policies (USING true). Decide if/when to lock them down.
-- - If you want admins to read other users, add a policy using role from users table.
