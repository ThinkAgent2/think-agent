import type { Challenge, Participation, UserLevel } from '@/types/database';

/**
 * Service for challenge-related business logic
 * Separates business rules from UI components and data fetching
 * 
 * NOTE: Tous les challenges sont accessibles librement.
 * Pas de verrouillage par prérequis ou niveau.
 * La progression vient de l'engagement, pas de la contrainte.
 */

/**
 * Group challenges by level
 */
export function groupChallengesByLevel(challenges: Challenge[]): Record<UserLevel, Challenge[]> {
  return {
    Explorer: challenges.filter((c) => c.niveau_associe === 'Explorer'),
    Crafter: challenges.filter((c) => c.niveau_associe === 'Crafter'),
    Architecte: challenges.filter((c) => c.niveau_associe === 'Architecte'),
  };
}

/**
 * Get participation for a specific challenge
 */
export function getParticipationForChallenge(
  challengeId: string,
  participations: Participation[]
): Participation | undefined {
  return participations.find((p) => p.challenge_id === challengeId);
}

/**
 * Check if user has completed a specific challenge
 */
export function hasCompletedChallenge(
  challengeId: string,
  participations: Participation[]
): boolean {
  const participation = getParticipationForChallenge(challengeId, participations);
  return participation?.statut === 'Terminé';
}

/**
 * Check if user is currently working on a challenge
 */
export function isInProgress(
  challengeId: string,
  participations: Participation[]
): boolean {
  const participation = getParticipationForChallenge(challengeId, participations);
  return participation?.statut === 'En_cours';
}

/**
 * Get list of completed challenge titles
 */
export function getCompletedChallengeTitles(
  participations: Participation[],
  challenges: Challenge[]
): string[] {
  return participations
    .filter((p) => p.statut === 'Terminé')
    .map((p) => {
      const challenge = challenges.find((c) => c.id === p.challenge_id);
      return challenge?.titre;
    })
    .filter((title): title is string => Boolean(title));
}

/**
 * Get challenge completion stats for a user
 */
export function getChallengeStats(
  participations: Participation[],
  challenges: Challenge[]
): {
  total: number;
  completed: number;
  inProgress: number;
  completionRate: number;
} {
  const completed = participations.filter((p) => p.statut === 'Terminé').length;
  const inProgress = participations.filter((p) => p.statut === 'En_cours').length;
  const total = challenges.length;

  return {
    total,
    completed,
    inProgress,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * Filter challenges based on criteria
 */
export function filterChallenges(
  challenges: Challenge[],
  filters: {
    niveau?: UserLevel;
    marque?: string;
    difficulte?: number;
    search?: string;
  }
): Challenge[] {
  let result = [...challenges];

  if (filters.niveau) {
    result = result.filter((c) => c.niveau_associe === filters.niveau);
  }

  if (filters.marque && filters.marque !== 'Tous') {
    result = result.filter((c) => c.marque === filters.marque || c.marque === 'Tous');
  }

  if (filters.difficulte) {
    result = result.filter((c) => c.difficulte === filters.difficulte);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.titre.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
    );
  }

  return result;
}
