import { createAdminClient } from '@/lib/supabase/admin';
import type { Challenge } from '@/types/database';
import { calculateLevel } from '@/services/progressionService';

export async function handleChallengeValidatedAdmin(userId: string, challenge: Challenge) {
  const admin = createAdminClient();
  const { data: user } = await admin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) return;

  const xpGlobal = (user.xp_global || 0) + challenge.xp;
  const xpWeekly = (user.xp_weekly || 0) + challenge.xp;
  const levelGlobal = calculateLevel(xpGlobal);

  const explorerCompleted = (user.explorer_completed_count || 0) + (challenge.niveau_associe === 'Explorer' ? 1 : 0);
  const crafterCompleted = (user.crafter_completed_count || 0) + (challenge.niveau_associe === 'Crafter' ? 1 : 0);
  const architectCompleted = (user.architect_completed_count || 0) + (challenge.niveau_associe === 'Architecte' ? 1 : 0);

  await admin
    .from('users')
    .update({
      xp_global: xpGlobal,
      xp_weekly: xpWeekly,
      level_global: levelGlobal,
      explorer_completed_count: explorerCompleted,
      crafter_completed_count: crafterCompleted,
      architect_completed_count: architectCompleted,
    })
    .eq('id', userId);
}

export async function updateLeagueWeeklyAdmin() {
  const admin = createAdminClient();
  const { data: users } = await admin
    .from('users')
    .select('id, xp_weekly, league');

  if (!users) return;

  const sorted = [...users].sort((a, b) => (b.xp_weekly || 0) - (a.xp_weekly || 0));
  const total = sorted.length;
  if (total === 0) return;

  const topCut = Math.ceil(total * 0.2);
  const bottomCut = Math.ceil(total * 0.2);

  const order = ['Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Master'] as const;

  for (let i = 0; i < sorted.length; i += 1) {
    const user = sorted[i];
    const idx = order.indexOf((user.league || 'Bronze') as typeof order[number]);
    let nextLeague = order[idx];
    if (i < topCut && idx < order.length - 1) nextLeague = order[idx + 1];
    if (i >= total - bottomCut && idx > 0) nextLeague = order[idx - 1];

    await admin
      .from('users')
      .update({ league: nextLeague, xp_weekly: 0 })
      .eq('id', user.id);
  }
}
