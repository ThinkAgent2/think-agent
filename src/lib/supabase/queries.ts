import { createClient } from './client';
import type { 
  User, Challenge, Participation, Solution, 
  Badge, DojoEvent, ChallengeFilters, LeaderboardEntry,
  UserLevel, ChallengeStatus, IdeaProposal, IdeaVote, IdeaWithVotes
} from '@/types/database';
import { formatNameFromEmail } from '@/lib/userName';
import { localizeChallenge, localizeBadge, localizeDojoEvent } from './localization';

const supabase = createClient();

function shouldUpdateName(user: User, inferredName: string | null): boolean {
  if (!inferredName) return false;
  if (!user.nom) return true;
  return user.nom.trim().toLowerCase() === 'anonyme';
}

async function maybeUpdateUserName(user: User): Promise<User> {
  const inferredName = formatNameFromEmail(user.email);
  if (shouldUpdateName(user, inferredName)) {
    const updated = await updateUser(user.id, { nom: inferredName });
    return updated ?? { ...user, nom: inferredName };
  }
  return user;
}

// ==========================================
// USERS
// ==========================================

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error);
  }

  if (data) {
    return await maybeUpdateUserName(data);
  }

  return data;
}

export async function getUserByAuthId(authId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by auth id:', error);
  }

  if (data) {
    return await maybeUpdateUserName(data);
  }

  return data;
}

export async function searchUsers(
  searchTerm: string,
  limit = 5
): Promise<Array<{ id: string; nom: string; email: string }>> {
  const { data, error } = await supabase
    .from('users')
    .select('id, nom, email')
    .or(`nom.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return data || [];
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return data;
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }

  return await maybeUpdateUserName(data);
}

// ==========================================
// CHALLENGES
// ==========================================

export async function getChallenges(filters?: ChallengeFilters, locale: string = 'fr'): Promise<Challenge[]> {
  let query = supabase
    .from('challenges')
    .select('*')
    .in('statut', ['Actif', 'Publie'])
    .order('difficulte', { ascending: true });

  if (filters?.niveau) {
    query = query.eq('niveau_associe', filters.niveau);
  }
  // Filtre marques : affiche les challenges contenant la marque OU transverses ([])
  if (filters?.marque) {
    query = query.or(`marques.cs.["${filters.marque}"],marques.eq.[]`);
  }
  if (filters?.difficulte) {
    query = query.eq('difficulte', filters.difficulte);
  }
  if (filters?.search) {
    query = query.or(`titre.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
  return (data || []).map(challenge => localizeChallenge(challenge, locale));
}

export async function getChallengesByStatus(statuses: Array<Challenge['statut']>): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .in('statut', statuses)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching challenges by status:', error);
    return [];
  }
  return data || [];
}

export async function getChallengeById(id: string, locale: string = 'fr'): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching challenge:', error);
    return null;
  }
  return data ? localizeChallenge(data, locale) : null;
}

export async function updateChallenge(
  id: string,
  updates: Partial<Challenge>
): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating challenge:', error);
    return null;
  }
  return data;
}

export async function deleteChallenge(id: string): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('challenges')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting challenge:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function createChallenge(
  challenge: Omit<Challenge, 'id' | 'created_at'>
): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .insert(challenge)
    .select()
    .single();

  if (error) {
    console.error('Error creating challenge:', error);
    return null;
  }
  return data;
}

export async function createChallengeProposal(
  challenge: Omit<Challenge, 'id' | 'created_at'>
): Promise<{ data: Challenge | null; error: string | null }> {
  const { data, error } = await supabase
    .from('challenges')
    .insert(challenge)
    .select()
    .single();

  if (error) {
    console.error('Error creating challenge proposal:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function findChallengeByTitle(title: string): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .ilike('titre', title)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error finding challenge by title:', error);
    return null;
  }

  return data;
}

export async function getUserChallenges(userId: string): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('auteur_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user challenges:', error);
    return [];
  }

  return data || [];
}

// ==========================================
// PARTICIPATIONS
// ==========================================

export async function getUserParticipations(userId: string): Promise<(Participation & { challenge: Challenge })[]> {
  const { data, error } = await supabase
    .from('participations')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching participations:', error);
    return [];
  }
  return data || [];
}

export async function getParticipation(userId: string, challengeId: string): Promise<Participation | null> {
  const { data, error } = await supabase
    .from('participations')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching participation:', error);
  }
  return data;
}

export async function createParticipation(userId: string, challengeId: string): Promise<Participation | null> {
  // D'abord vérifier s'il existe une participation abandonnée
  const existing = await getParticipation(userId, challengeId);
  
  if (existing && existing.statut === 'Abandonné') {
    // Réactiver la participation
    return updateParticipation(userId, challengeId, { statut: 'En_cours' });
  }

  // Sinon créer une nouvelle participation
  const { data, error } = await supabase
    .from('participations')
    .insert({ user_id: userId, challenge_id: challengeId })
    .select()
    .single();

  if (error) {
    console.error('Error creating participation:', error);
    return null;
  }
  return data;
}

export async function updateParticipation(
  userId: string, 
  challengeId: string, 
  updates: Partial<Participation>
): Promise<Participation | null> {
  const { data, error } = await supabase
    .from('participations')
    .update(updates)
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating participation:', error);
    return null;
  }
  return data;
}

export async function abandonParticipation(userId: string, challengeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('participations')
    .update({ statut: 'Abandonné' })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId);

  if (error) {
    console.error('Error abandoning participation:', error);
    return false;
  }
  return true;
}

// ==========================================
// SOLUTIONS
// ==========================================

export async function getSolution(userId: string, challengeId: string): Promise<Solution | null> {
  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching solution:', error);
  }
  return data;
}

export async function getUserSolutions(userId: string): Promise<Solution[]> {
  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user solutions:', error);
    return [];
  }
  return data || [];
}

export async function submitSolution(
  userId: string,
  challengeId: string,
  contenuTexte: string,
  fichiers?: string[]
): Promise<Solution | null> {
  const { data: existing } = await supabase
    .from('solutions')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .maybeSingle();

  const payload = {
    user_id: userId,
    challenge_id: challengeId,
    contenu_texte: contenuTexte,
    fichiers_attaches: fichiers || [],
    statut: 'Soumise' as Solution['statut'],
    note: null,
    feedback_reviewer: null,
  };

  const { data, error } = existing
    ? await supabase
        .from('solutions')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
    : await supabase
        .from('solutions')
        .insert(payload)
        .select()
        .single();

  if (error) {
    console.error('Error submitting solution:', error);
    return null;
  }

  return data;
}

export async function evaluateSolution(
  userId: string,
  challengeId: string,
  note: number,
  feedback?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('solutions')
    .update({ statut: 'Évaluée', note, feedback_reviewer: feedback ?? null })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId);

  if (error) {
    console.error('Error evaluating solution:', error);
    return false;
  }

  if (note >= 3) {
    await updateParticipation(userId, challengeId, { statut: 'Terminé' });
    const challenge = await getChallengeById(challengeId);
    if (challenge) {
      await addUserXP(userId, challenge.xp);
    }
    await checkAndUpdateLevelAndBadges(userId);
  }

  return true;
}

export async function markSolutionViewed(userId: string, challengeId: string): Promise<void> {
  await supabase
    .from('solutions')
    .update({ a_consulte_solution: true })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId);
}

// ==========================================
// BADGES
// ==========================================

export async function getAllBadges(locale: string = 'fr'): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('badges')
    .select('*');

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
  return (data || []).map(badge => localizeBadge(badge, locale));
}

export async function getUserBadges(userId: string, locale: string = 'fr'): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      badge:badges(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
  return (data?.map(d => d.badge as unknown as Badge) || []).map(badge => localizeBadge(badge, locale));
}

export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_badges')
    .insert({ user_id: userId, badge_id: badgeId });

  if (error && error.code !== '23505') { // Ignore duplicate
    console.error('Error awarding badge:', error);
    return false;
  }
  return true;
}

// ==========================================
// ÉVÉNEMENTS DOJO
// ==========================================

export async function getDojoEvents(locale: string = 'fr'): Promise<DojoEvent[]> {
  const { data, error } = await supabase
    .from('evenements_dojo')
    .select('*')
    .order('date_debut', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return (data || []).map(event => localizeDojoEvent(event, locale));
}

export async function getDojoEventById(id: string): Promise<DojoEvent | null> {
  const { data, error } = await supabase
    .from('evenements_dojo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }
  return data;
}

export async function createDojoEvent(
  event: Omit<DojoEvent, 'id' | 'created_at'>
): Promise<DojoEvent | null> {
  const { data, error } = await supabase
    .from('evenements_dojo')
    .insert(event)
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }
  return data;
}

export async function updateDojoEvent(
  id: string,
  updates: Partial<DojoEvent>
): Promise<DojoEvent | null> {
  const { data, error } = await supabase
    .from('evenements_dojo')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    return null;
  }
  return data;
}

// ==========================================
// LEADERBOARD
// ==========================================

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      nom,
      email,
      niveau_actuel,
      points_totaux,
      marque_id
    `)
    .order('points_totaux', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  // Pour simplifier, on ne fait pas de join pour le nom de marque dans le MVP
  return (data || []).map((user, index) => {
    const inferredName = formatNameFromEmail(user.email);
    return {
      user_id: user.id,
      nom: user.nom || inferredName || 'Anonyme',
      niveau_actuel: user.niveau_actuel,
      points_totaux: user.points_totaux,
      marque: null, // Simplifié pour le MVP
      rank: index + 1,
    };
  });
}

export async function getLeaderboardRecent(limit: number = 10): Promise<LeaderboardEntry[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data, error } = await supabase
    .from('solutions')
    .select(`
      user_id,
      challenge:challenges!solutions_challenge_id_fkey(xp),
      user:users!solutions_user_id_fkey(id, nom, email, niveau_actuel, points_totaux)
    `)
    .eq('statut', 'Évaluée')
    .gte('updated_at', since.toISOString())
    .gte('note', 3);

  if (error) {
    console.error('Error fetching recent leaderboard:', error);
    return [];
  }

  const totals = new Map<string, { xp: number; user: { id: string; nom: string | null; email: string; niveau_actuel: UserLevel; points_totaux: number } }>();

  (data || []).forEach((row) => {
    const rawUser = (row as { user?: unknown }).user;
    const user = Array.isArray(rawUser) ? rawUser[0] ?? null : (rawUser ?? null);
    const rawChallenge = (row as { challenge?: unknown }).challenge;
    const challenge = Array.isArray(rawChallenge) ? rawChallenge[0] ?? null : (rawChallenge ?? null);

    if (!user || !challenge) return;

    const existing = totals.get((user as { id: string }).id);
    const xpToAdd = (challenge as { xp: number }).xp || 0;
    totals.set((user as { id: string }).id, {
      xp: (existing?.xp || 0) + xpToAdd,
      user: user as { id: string; nom: string | null; email: string; niveau_actuel: UserLevel; points_totaux: number },
    });
  });

  const leaderboard = Array.from(totals.values())
    .sort((a, b) => b.xp - a.xp)
    .slice(0, limit)
    .map((entry, index) => {
      const inferredName = formatNameFromEmail(entry.user.email);
      return {
        user_id: entry.user.id,
        nom: entry.user.nom || inferredName || 'Anonyme',
        niveau_actuel: entry.user.niveau_actuel,
        points_totaux: entry.user.points_totaux,
        points_30j: entry.xp,
        marque: null,
        rank: index + 1,
      };
    });

  return leaderboard;
}

export async function getUserRankAndTotal(userId: string, pointsTotaux: number): Promise<{ rank: number; total: number } | null> {
  const { count: total, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (countError || total === null) {
    console.error('Error fetching total users:', countError);
    return null;
  }

  const { count: betterCount, error: rankError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gt('points_totaux', pointsTotaux);

  if (rankError || betterCount === null) {
    console.error('Error fetching user rank:', rankError);
    return null;
  }

  return { rank: betterCount + 1, total };
}

// ==========================================
// RÉFÉRENCES
// ==========================================

export async function getMarques() {
  const { data, error } = await supabase
    .from('marques')
    .select('*')
    .order('nom');

  if (error) {
    console.error('Error fetching marques:', error);
    return [];
  }
  return data || [];
}

export async function getMetiers() {
  const { data, error } = await supabase
    .from('metiers')
    .select(`
      *,
      marque:marques(nom)
    `)
    .order('nom');

  if (error) {
    console.error('Error fetching metiers:', error);
    return [];
  }
  return data || [];
}

// ==========================================
// IDEAS
// ==========================================

type IdeaVoteCount = { idea_id: string; votes: number };

type IdeaVoteRow = { idea_id: string };

export async function getIdeasWithVotes(userId?: string | null): Promise<IdeaWithVotes[]> {
  const { data: ideas, error } = await supabase
    .from('idea_proposals')
    .select('*');

  if (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }

  const { data: counts, error: countError } = await supabase
    .from('idea_vote_counts')
    .select('*');

  if (countError) {
    console.error('Error fetching idea vote counts:', countError);
  }

  const votesMap = new Map<string, number>();
  (counts as IdeaVoteCount[] | null | undefined)?.forEach((row) => {
    votesMap.set(row.idea_id, row.votes);
  });

  let userVotesSet = new Set<string>();
  if (userId) {
    const { data: userVotes, error: userVoteError } = await supabase
      .from('idea_votes')
      .select('idea_id')
      .eq('user_id', userId);

    if (userVoteError) {
      console.error('Error fetching user votes:', userVoteError);
    }

    (userVotes as IdeaVoteRow[] | null | undefined)?.forEach((row) => {
      userVotesSet.add(row.idea_id);
    });
  }

  const mapped = (ideas || []).map((idea) => ({
    ...(idea as IdeaProposal),
    votes: votesMap.get(idea.id) ?? 0,
    hasVoted: userId ? userVotesSet.has(idea.id) : false,
  }));

  return mapped.sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function createIdeaProposal(
  idea: Omit<IdeaProposal, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: IdeaProposal | null; error: string | null }> {
  const { data, error } = await supabase
    .from('idea_proposals')
    .insert(idea)
    .select()
    .single();

  if (error) {
    console.error('Error creating idea proposal:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function voteIdea(ideaId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('idea_votes')
    .insert({ idea_id: ideaId, user_id: userId });

  if (error) {
    console.error('Error voting idea:', error);
    return false;
  }

  return true;
}

export async function updateIdeaProposal(
  id: string,
  updates: Partial<IdeaProposal>
): Promise<IdeaProposal | null> {
  const { data, error } = await supabase
    .from('idea_proposals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating idea proposal:', error);
    return null;
  }
  return data;
}

export async function getUserIdeas(userId: string): Promise<IdeaProposal[]> {
  const { data, error } = await supabase
    .from('idea_proposals')
    .select('*')
    .eq('auteur_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user ideas:', error);
    return [];
  }

  return data || [];
}

export async function getUserValidatedIdeas(userId: string): Promise<IdeaProposal[]> {
  const { data, error } = await supabase
    .from('idea_proposals')
    .select('*')
    .eq('auteur_id', userId)
    .eq('statut', 'Validee')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user validated ideas:', error);
    return [];
  }

  return data || [];
}

export async function deleteIdeaProposal(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('idea_proposals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting idea proposal:', error);
    return false;
  }
  return true;
}

// ==========================================
// LOGIQUE MÉTIER
// ==========================================

/**
 * Met à jour les XP de l'utilisateur après validation d'un challenge
 */
export async function addUserXP(userId: string, xp: number): Promise<void> {
  // Update direct des points
  const { data: currentUser } = await supabase
    .from('users')
    .select('points_totaux')
    .eq('id', userId)
    .single();

  if (currentUser) {
    await supabase
      .from('users')
      .update({ points_totaux: (currentUser.points_totaux || 0) + xp })
      .eq('id', userId);
  }
}

/**
 * Seuils de niveau par type de challenge
 * - Explorer: 2 challenges Explorer
 * - Crafter: 5 challenges Crafter
 * - Architecte: 2 challenges Architecte
 */
const LEVEL_THRESHOLDS = {
  Explorer: 2,
  Crafter: 5,
  Architecte: 2,
};

/**
 * Badges de volume par niveau
 */
const VOLUME_BADGES: Record<string, number[]> = {
  Explorer: [2, 5, 10],
  Crafter: [5, 10],
  Architecte: [2, 5, 10],
};

/**
 * Vérifie et met à jour le niveau de l'utilisateur + attribue les badges de volume
 */
export async function checkAndUpdateLevelAndBadges(userId: string): Promise<void> {
  const participations = await getUserParticipations(userId);
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) return;

  // Compter les challenges terminés par niveau
  const completedByLevel: Record<string, number> = {
    Explorer: 0,
    Crafter: 0,
    Architecte: 0,
  };

  for (const p of participations) {
    if (p.statut === 'Terminé' && p.challenge) {
      completedByLevel[p.challenge.niveau_associe]++;
    }
  }

  // Déterminer le niveau actuel (basé sur les seuils atteints)
  let newLevel: UserLevel = 'Explorer'; // Niveau par défaut

  if (completedByLevel.Architecte >= LEVEL_THRESHOLDS.Architecte) {
    newLevel = 'Architecte';
  } else if (completedByLevel.Crafter >= LEVEL_THRESHOLDS.Crafter) {
    newLevel = 'Crafter';
  } else if (completedByLevel.Explorer >= LEVEL_THRESHOLDS.Explorer) {
    newLevel = 'Explorer';
  }

  // Mettre à jour le niveau si changé
  if (newLevel !== user.niveau_actuel) {
    await updateUser(userId, { niveau_actuel: newLevel });
  }

  // Attribuer les badges conditionnels
  await awardConditionalBadges(userId, completedByLevel);
}

const LEVEL_ORDER: Record<UserLevel, number> = {
  Explorer: 1,
  Crafter: 2,
  Architecte: 3,
};

async function awardConditionalBadges(
  userId: string,
  completedByLevel: Record<string, number>
): Promise<void> {
  const allBadges = await getAllBadges();

  const { data: user } = await supabase
    .from('users')
    .select('id, role, niveau_actuel, auth_id')
    .eq('id', userId)
    .single();

  const { data: validatedSolutions } = await supabase
    .from('solutions')
    .select(`
      challenge_id,
      created_at,
      challenge:challenges(niveau_associe, participants)
    `)
    .eq('user_id', userId)
    .eq('statut', 'Évaluée')
    .gte('note', 3);

  const validatedChallengeIds = new Set<string>();
  const validatedByLevel: Record<string, number> = {
    Explorer: 0,
    Crafter: 0,
    Architecte: 0,
  };

  let hasDuoChallenge = false;
  let monthlyValidated = 0;
  const since = new Date();
  since.setDate(since.getDate() - 30);

  (validatedSolutions || []).forEach((row) => {
    const challenge = (row as { challenge?: { niveau_associe: UserLevel; participants: string } | null }).challenge;
    if (!challenge) return;
    if (!validatedChallengeIds.has(row.challenge_id)) {
      validatedChallengeIds.add(row.challenge_id);
      validatedByLevel[challenge.niveau_associe]++;
    }
    if (challenge.participants === 'Duo') {
      hasDuoChallenge = true;
    }
    if (new Date(row.created_at) >= since) {
      monthlyValidated++;
    }
  });

  const { data: challengesData } = await supabase
    .from('challenges')
    .select('id, niveau_associe')
    .in('statut', ['Actif', 'Publie']);

  const totalByLevel: Record<string, number> = {
    Explorer: 0,
    Crafter: 0,
    Architecte: 0,
  };

  (challengesData || []).forEach((challenge) => {
    totalByLevel[challenge.niveau_associe]++;
  });

  const shouldAward = (badge: BadgeType): boolean => {
    const conditions = badge.conditions as Record<string, unknown> | null;
    if (!conditions) return false;

    if (typeof conditions.challenges_completed === 'number') {
      return validatedChallengeIds.size >= conditions.challenges_completed;
    }

    if (typeof conditions.level_reached === 'string' && user) {
      const required = conditions.level_reached as UserLevel;
      return LEVEL_ORDER[user.niveau_actuel] >= LEVEL_ORDER[required];
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

    if (typeof conditions.role === 'string' && user) {
      return conditions.role === 'Admin' ? user.role === 'Administrateur' : user.role === conditions.role;
    }

    if (conditions.pr_merged === true) {
      return Boolean((user as { pr_merged?: boolean } | null)?.pr_merged);
    }

    return false;
  };

  for (const badge of allBadges) {
    if (shouldAward(badge)) {
      await awardBadge(userId, badge.id);
    }
  }
}

/**
 * @deprecated Utiliser checkAndUpdateLevelAndBadges à la place
 */
export async function checkAndUpdateLevel(userId: string): Promise<void> {
  await checkAndUpdateLevelAndBadges(userId);
}
