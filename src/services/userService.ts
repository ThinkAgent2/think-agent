import type { User, UserLevel, Participation, Challenge } from '@/types/database';

/**
 * Service for user-related business logic
 */

// XP thresholds for level progression
const LEVEL_THRESHOLDS = {
  Explorer: 0,
  Crafter: 200,
  Architecte: 500,
};

// Minimum challenges to complete per level for progression
const CHALLENGES_FOR_LEVEL_UP = 2;

/**
 * Calculate the next level based on completed challenges
 */
export function calculateNextLevel(
  currentLevel: UserLevel,
  participations: Participation[],
  challenges: Challenge[]
): UserLevel | null {
  // Count completed challenges by level
  const completedByLevel = countCompletedByLevel(participations, challenges);

  if (currentLevel === 'Explorer' && completedByLevel.Explorer >= CHALLENGES_FOR_LEVEL_UP) {
    return 'Crafter';
  }

  if (currentLevel === 'Crafter' && completedByLevel.Crafter >= CHALLENGES_FOR_LEVEL_UP) {
    return 'Architecte';
  }

  return null; // No level up available
}

/**
 * Count completed challenges by level
 */
export function countCompletedByLevel(
  participations: Participation[],
  challenges: Challenge[]
): Record<UserLevel, number> {
  const counts: Record<UserLevel, number> = {
    Explorer: 0,
    Crafter: 0,
    Architecte: 0,
  };

  for (const participation of participations) {
    if (participation.statut === 'Terminé') {
      const challenge = challenges.find((c) => c.id === participation.challenge_id);
      if (challenge) {
        counts[challenge.niveau_associe]++;
      }
    }
  }

  return counts;
}

/**
 * Calculate total XP from completed challenges
 */
export function calculateTotalXP(
  participations: Participation[],
  challenges: Challenge[]
): number {
  return participations
    .filter((p) => p.statut === 'Terminé')
    .reduce((total, participation) => {
      const challenge = challenges.find((c) => c.id === participation.challenge_id);
      return total + (challenge?.xp || 0);
    }, 0);
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentLevel: UserLevel): number | null {
  if (currentLevel === 'Explorer') {
    return LEVEL_THRESHOLDS.Crafter;
  }
  if (currentLevel === 'Crafter') {
    return LEVEL_THRESHOLDS.Architecte;
  }
  return null; // Already at max level
}

/**
 * Calculate progress percentage to next level
 */
export function getLevelProgress(
  currentLevel: UserLevel,
  totalXP: number
): number {
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = getXPForNextLevel(currentLevel);

  if (nextThreshold === null) {
    return 100; // Max level
  }

  const xpInCurrentLevel = totalXP - currentThreshold;
  const xpNeededForNext = nextThreshold - currentThreshold;

  return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));
}

/**
 * Get user display name (fallback to email prefix if no name)
 */
export function getUserDisplayName(user: User): string {
  if (user.nom) {
    return user.nom;
  }
  // Extract name from email (before @)
  return user.email.split('@')[0];
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User): string {
  const displayName = getUserDisplayName(user);
  const parts = displayName.split(/[\s._-]+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: User): boolean {
  return user.role === 'Administrateur';
}

/**
 * Check if user is mentor
 */
export function isMentor(user: User): boolean {
  return user.role === 'Mentor' || user.role === 'Administrateur';
}

/**
 * Get level color class
 */
export function getLevelColorClass(level: UserLevel): string {
  const colors = {
    Explorer: 'text-accent-vert',
    Crafter: 'text-exalt-blue',
    Architecte: 'text-accent-rose',
  };
  return colors[level];
}

/**
 * Get level background class
 */
export function getLevelBgClass(level: UserLevel): string {
  const colors = {
    Explorer: 'bg-accent-vert',
    Crafter: 'bg-exalt-blue',
    Architecte: 'bg-accent-rose',
  };
  return colors[level];
}
