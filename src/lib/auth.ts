'use client';

import { createContext, useContext } from 'react';
import type { User } from '@/types/database';

// Cookie/localStorage key
const USER_STORAGE_KEY = 'think_agent_user';

// Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
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

// Fonctions utilitaires pour le stockage
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_STORAGE_KEY);
}
