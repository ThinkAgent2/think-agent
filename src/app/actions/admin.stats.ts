'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { Solution, User } from '@/types/database';

interface AdminChallengeStatsResult {
  solutions: Array<Solution & { user: Pick<User, 'id' | 'email' | 'nom'> | null }>;
  participants: Array<{ user: Pick<User, 'id' | 'email' | 'nom'> | null; user_id?: string; statut: string }>;
  participantsCount: number;
}

export async function getAdminChallengeStats(
  challengeId: string
): Promise<AdminChallengeStatsResult | null> {
  try {
    const supabase = createAdminClient();
    const supabaseAuth = await createClient();

    const { data: authData, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authData?.user) return null;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !user || user.role !== 'Administrateur') {
      return null;
    }

    const [{ data: solutionsData, error: solutionsError }, { data: participantsData, count: participantsCount, error: participantsError }] = await Promise.all([
      supabase
        .from('solutions')
        .select(`*, user:users!solutions_user_id_fkey(id, email, nom)`)
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: false }),
      supabase
        .from('participations')
        .select(`user_id, statut, user:users!participations_user_id_fkey(id, email, nom)`, { count: 'exact' })
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: false }),
    ]);

    if (solutionsError) {
      console.error('Admin stats: error fetching solutions', solutionsError);
    }
    if (participantsError) {
      console.error('Admin stats: error fetching participations', participantsError);
    }

    const normalizedParticipants = (participantsData ?? []).map((participant) => {
      const rawUser = (participant as { user?: unknown }).user;
      const user = Array.isArray(rawUser) ? rawUser[0] ?? null : (rawUser ?? null);
      return {
        statut: (participant as { statut: string }).statut,
        user_id: (participant as { user_id?: string }).user_id,
        user: user as Pick<User, 'id' | 'email' | 'nom'> | null,
      };
    });

    return {
      solutions: (solutionsData as Array<Solution & { user: Pick<User, 'id' | 'email' | 'nom'> | null }>) ?? [],
      participants: normalizedParticipants,
      participantsCount: participantsCount ?? 0,
    };
  } catch (error) {
    console.error('Error fetching admin challenge stats:', error);
    return null;
  }
}
