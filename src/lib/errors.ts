/**
 * Custom error class for query/API errors
 */
export class QueryError extends Error {
  public readonly code: string;
  public readonly originalError?: unknown;

  constructor(code: string, message: string, originalError?: unknown) {
    super(message);
    this.name = 'QueryError';
    this.code = code;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryError);
    }
  }

  static fromSupabaseError(error: { code?: string; message: string }): QueryError {
    return new QueryError(
      error.code || 'UNKNOWN',
      error.message,
      error
    );
  }
}

/**
 * Error codes for common scenarios
 */
export const ErrorCodes = {
  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_CREATE_FAILED: 'USER_CREATE_FAILED',
  USER_UPDATE_FAILED: 'USER_UPDATE_FAILED',

  // Challenge errors
  CHALLENGE_NOT_FOUND: 'CHALLENGE_NOT_FOUND',
  CHALLENGE_FETCH_FAILED: 'CHALLENGE_FETCH_FAILED',

  // Participation errors
  PARTICIPATION_NOT_FOUND: 'PARTICIPATION_NOT_FOUND',
  PARTICIPATION_CREATE_FAILED: 'PARTICIPATION_CREATE_FAILED',

  // Solution errors
  SOLUTION_SUBMIT_FAILED: 'SOLUTION_SUBMIT_FAILED',

  // Generic errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * User-friendly error messages
 */
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.USER_NOT_FOUND]: 'Utilisateur non trouvé.',
  [ErrorCodes.USER_CREATE_FAILED]: 'Impossible de créer le compte.',
  [ErrorCodes.USER_UPDATE_FAILED]: 'Impossible de mettre à jour le profil.',
  [ErrorCodes.CHALLENGE_NOT_FOUND]: 'Challenge non trouvé.',
  [ErrorCodes.CHALLENGE_FETCH_FAILED]: 'Impossible de charger les challenges.',
  [ErrorCodes.PARTICIPATION_CREATE_FAILED]: 'Impossible de rejoindre le challenge.',
  [ErrorCodes.SOLUTION_SUBMIT_FAILED]: 'Impossible de soumettre la solution.',
  [ErrorCodes.NETWORK_ERROR]: 'Erreur de connexion. Vérifiez votre connexion internet.',
  [ErrorCodes.UNKNOWN]: 'Une erreur inattendue s\'est produite.',
};

/**
 * Get user-friendly message for an error code
 */
export function getErrorMessage(code: string): string {
  return ErrorMessages[code] || ErrorMessages[ErrorCodes.UNKNOWN];
}
