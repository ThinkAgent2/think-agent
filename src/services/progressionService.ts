import { createClient } from '@/lib/supabase/client';
import type { Badge, Challenge, UserLevel } from '@/types/database';

const LEVEL_TITLE_THRESHOLDS = [
  { min: 3, title: 'I' },
  { min: 7, title: 'II' },
  { min: 15, title: 'III' },
  { min: 25, title: 'IV' },
  { min: 50, title: 'Maître' },
];

export type ThemeTitle = 'I' | 'II' | 'III' | 'IV' | 'Maître' | '—';

export function getThemeTitle(completedCount: number): ThemeTitle {
  const eligible = LEVEL_TITLE_THRESHOLDS.filter((t) => completedCount >= t.min);
  if (eligible.length === 0) return '—';
  return eligible[eligible.length - 1].title as ThemeTitle;
}

export function getEarnedTitles(completedCount: number, label: string): string[] {
  return LEVEL_TITLE_THRESHOLDS
    .filter((t) => completedCount >= t.min)
    .map((t) => `${label} ${t.title}`);
}

export function getThemeProgress(completedCount: number) {
  const thresholds = [3, 7, 15, 25, 50];
  const next = thresholds.find((t) => completedCount < t) ?? null;
  const current = next ? thresholds[thresholds.indexOf(next) - 1] ?? 0 : 50;
  const progress = next ? (completedCount - current) / (next - current) : 1;
  return { progress: Math.max(0, Math.min(progress, 1)), nextTarget: next };
}

export function getRequiredXp(level: number) {
  return Math.round(100 * Math.pow(1.3, Math.max(0, level - 1)));
}

export function calculateLevel(xp: number) {
  let level = 1;
  let threshold = getRequiredXp(level);
  while (xp >= threshold) {
    xp -= threshold;
    level += 1;
    threshold = getRequiredXp(level);
  }
  return level;
}

export async function handleChallengeValidated(userId: string, challenge: Challenge) {
  const supabase = createClient();

  const { data: user } = await supabase
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

  const updates = {
    xp_global: xpGlobal,
    xp_weekly: xpWeekly,
    level_global: levelGlobal,
    explorer_completed_count: explorerCompleted,
    crafter_completed_count: crafterCompleted,
    architect_completed_count: architectCompleted,
  };

  await supabase.from('users').update(updates).eq('id', userId);

  await updateStreak(userId);
  await checkAndUnlockBadges(userId);
}

export async function updateStreak(userId: string) {
  const supabase = createClient();
  const { data: user } = await supabase
    .from('users')
    .select('current_streak, max_streak, last_active_date')
    .eq('id', userId)
    .single();

  if (!user) return;

  const today = new Date().toISOString().slice(0, 10);
  const lastActive = user.last_active_date;

  let current = user.current_streak || 0;
  if (!lastActive) {
    current = 1;
  } else if (lastActive === today) {
    current = current || 1;
  } else {
    const lastDate = new Date(lastActive);
    const diff = (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current += 1;
    } else {
      current = 1;
    }
  }

  const maxStreak = Math.max(user.max_streak || 0, current);

  await supabase
    .from('users')
    .update({ current_streak: current, max_streak: maxStreak, last_active_date: today })
    .eq('id', userId);
}

export async function checkAndUnlockBadges(userId: string) {
  const supabase = createClient();
  const { data: allBadges } = await supabase.from('badges').select('*');
  if (!allBadges) return;

  const { data: user } = await supabase
    .from('users')
    .select('current_streak')
    .eq('id', userId)
    .single();

  if (!user) return;

  const shouldAward = (badge: Badge) => {
    const conditions = (badge.condition_json || badge.conditions) as Record<string, unknown> | null;
    if (!conditions) return false;
    if (typeof conditions.streak_days === 'number') {
      return (user.current_streak || 0) >= conditions.streak_days;
    }
    return false;
  };

  for (const badge of allBadges) {
    if (shouldAward(badge)) {
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id });
    }
  }
}

export async function updateThemeProgression(userId: string) {
  const supabase = createClient();
  const { data: participations } = await supabase
    .from('participations')
    .select('statut, challenge:challenges(niveau_associe)')
    .eq('user_id', userId)
    .eq('statut', 'Terminé');

  if (!participations) return;
  const counts = { Explorer: 0, Crafter: 0, Architecte: 0 } as Record<UserLevel, number>;

  participations.forEach((row) => {
    const challenge = Array.isArray(row.challenge) ? row.challenge[0] : row.challenge;
    if (!challenge) return;
    counts[challenge.niveau_associe as UserLevel] += 1;
  });

  await supabase
    .from('users')
    .update({
      explorer_completed_count: counts.Explorer,
      crafter_completed_count: counts.Crafter,
      architect_completed_count: counts.Architecte,
    })
    .eq('id', userId);
}
