import { describe, it, expect } from 'vitest';
import { QueryError, ErrorCodes, getErrorMessage } from './errors';

describe('QueryError', () => {
  it('should create error with code and message', () => {
    const error = new QueryError('TEST_ERROR', 'Test error message');
    
    expect(error.code).toBe('TEST_ERROR');
    expect(error.message).toBe('Test error message');
    expect(error.name).toBe('QueryError');
  });

  it('should store original error', () => {
    const originalError = new Error('Original');
    const error = new QueryError('TEST', 'Wrapped', originalError);
    
    expect(error.originalError).toBe(originalError);
  });

  it('should create from Supabase error', () => {
    const supabaseError = { code: 'PGRST116', message: 'Not found' };
    const error = QueryError.fromSupabaseError(supabaseError);
    
    expect(error.code).toBe('PGRST116');
    expect(error.message).toBe('Not found');
  });

  it('should handle Supabase error without code', () => {
    const supabaseError = { message: 'Something went wrong' };
    const error = QueryError.fromSupabaseError(supabaseError);
    
    expect(error.code).toBe('UNKNOWN');
    expect(error.message).toBe('Something went wrong');
  });
});

describe('ErrorCodes', () => {
  it('should have all expected codes', () => {
    expect(ErrorCodes.USER_NOT_FOUND).toBe('USER_NOT_FOUND');
    expect(ErrorCodes.CHALLENGE_NOT_FOUND).toBe('CHALLENGE_NOT_FOUND');
    expect(ErrorCodes.NETWORK_ERROR).toBe('NETWORK_ERROR');
    expect(ErrorCodes.UNKNOWN).toBe('UNKNOWN');
  });
});

describe('getErrorMessage', () => {
  it('should return message for known error code', () => {
    const message = getErrorMessage(ErrorCodes.USER_NOT_FOUND);
    expect(message).toBe('Utilisateur non trouvé.');
  });

  it('should return message for network error', () => {
    const message = getErrorMessage(ErrorCodes.NETWORK_ERROR);
    expect(message).toContain('connexion');
  });

  it('should return default message for unknown code', () => {
    const message = getErrorMessage('SOME_UNKNOWN_CODE');
    expect(message).toBe('Une erreur inattendue s\'est produite.');
  });
});
