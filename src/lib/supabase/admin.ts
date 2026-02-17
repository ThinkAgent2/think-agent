import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase admin avec service_role key
 * ATTENTION: Ce client bypass les RLS policies
 * À utiliser uniquement côté serveur pour les opérations admin
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
