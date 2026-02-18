'use client';

import { createContext, useContext } from 'react';
import type { User } from '@/types/database';

// Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Context (sera initialisé dans le provider)
export const AuthContext = createContext<AuthContextType | null>(null);

// Hook pour utiliser l'auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
