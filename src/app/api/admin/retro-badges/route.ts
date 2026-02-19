import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getAllBadges } from '@/lib/supabase/queries';
import type { UserLevel } from '@/types/database';

export async function POST() {
  try {
    const supabaseAdmin = createAdminClient();
    const supabaseAuth = await createClient();

    const { data: authData, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !user || user.role !== 'Administrateur') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, role, niveau_actuel, auth_id, pr_merged');

    if (error || !users) {
      return NextResponse.json({ error: 'Erreur récupération users' }, { status: 500 });
    }

    const LEVEL_ORDER: Record<UserLevel, number> = {
      Explorer: 1,
      Crafter: 2,
      Architecte: 3,
    };

    const allBadges = await getAllBadges('fr');

    let processed = 0;
    for (const u of users) {
      const { data: participations } = await supabaseAdmin
        .from('participations')
        .select('statut, challenge:challenges(niveau_associe)')
        .eq('user_id', u.id);

      const completedByLevel: Record<UserLevel, number> = {
        Explorer: 0,
        Crafter: 0,
        Architecte: 0,
      };

      (participations || []).forEach((p) => {
        const rawChallenge = (p as { challenge?: unknown }).challenge;
        const challenge = Array.isArray(rawChallenge) ? rawChallenge[0] ?? null : (rawChallenge ?? null);
        if (p.statut === 'Terminé' && challenge) {
          completedByLevel[(challenge as { niveau_associe: UserLevel }).niveau_associe]++;
        }
      });

      const { data: validatedSolutions } = await supabaseAdmin
        .from('solutions')
        .select('challenge_id, created_at, challenge:challenges!solutions_challenge_id_fkey(niveau_associe, participants)')
        .eq('user_id', u.id)
        .eq('statut', 'Évaluée')
        .gte('note', 3);

      const validatedChallengeIds = new Set<string>();
      const validatedByLevel: Record<UserLevel, number> = {
        Explorer: 0,
        Crafter: 0,
        Architecte: 0,
      };

      let hasDuoChallenge = false;
      let monthlyValidated = 0;
      const since = new Date();
      since.setDate(since.getDate() - 30);

      (validatedSolutions || []).forEach((row) => {
        const rawChallenge = (row as { challenge?: unknown }).challenge;
        const challenge = Array.isArray(rawChallenge) ? rawChallenge[0] ?? null : (rawChallenge ?? null);
        if (!challenge) return;

        if (!validatedChallengeIds.has(row.challenge_id)) {
          validatedChallengeIds.add(row.challenge_id);
          validatedByLevel[(challenge as { niveau_associe: UserLevel }).niveau_associe]++;
        }
        if ((challenge as { participants: string }).participants === 'Duo') {
          hasDuoChallenge = true;
        }
        if (new Date(row.created_at) >= since) {
          monthlyValidated++;
        }
      });

      const { data: challengesData } = await supabaseAdmin
        .from('challenges')
        .select('id, niveau_associe')
        .in('statut', ['Actif', 'Publie']);

      const totalByLevel: Record<UserLevel, number> = {
        Explorer: 0,
        Crafter: 0,
        Architecte: 0,
      };

      (challengesData || []).forEach((challenge) => {
        const level = (challenge.niveau_associe as UserLevel) || 'Explorer';
        totalByLevel[level]++;
      });

      const shouldAward = (badge: { conditions: Record<string, unknown> }): boolean => {
        const conditions = badge.conditions || {};

        if (typeof conditions.challenges_completed === 'number') {
          return validatedChallengeIds.size >= conditions.challenges_completed;
        }

        if (typeof conditions.level_reached === 'string') {
          const required = conditions.level_reached as UserLevel;
          const currentLevel = u.niveau_actuel as UserLevel;
          return LEVEL_ORDER[currentLevel] >= LEVEL_ORDER[required];
        }

        if (conditions.duo_challenge === true) {
          return hasDuoChallenge;
        }

        if (typeof conditions.monthly_challenges === 'number') {
          return monthlyValidated >= conditions.monthly_challenges;
        }

        if (typeof conditions.level_complete === 'string') {
          const level = conditions.level_complete as UserLevel;
          return totalByLevel[level] > 0 && validatedByLevel[level] >= totalByLevel[level];
        }

        if (typeof conditions.role === 'string') {
          return conditions.role === 'Admin' ? u.role === 'Administrateur' : u.role === conditions.role;
        }

        if (conditions.pr_merged === true) {
          return Boolean(u.pr_merged);
        }

        return false;
      };

      for (const badge of allBadges) {
        if (shouldAward(badge)) {
          await supabaseAdmin
            .from('user_badges')
            .insert({ user_id: u.id, badge_id: badge.id })
            .select()
            .single();
        }
      }

      processed++;
    }

    return NextResponse.json({ ok: true, processed });
  } catch (error) {
    console.error('retro-badges error', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
