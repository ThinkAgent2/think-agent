'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext, getStoredUser, setStoredUser, clearStoredUser } from '@/lib/auth';
import { getOrCreateUser, getUserByEmail } from '@/lib/supabase/queries';
import type { User } from '@/types/database';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis le stockage au démarrage
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      // Vérifier que l'utilisateur existe toujours en BDD
      getUserByEmail(storedUser.email).then((dbUser) => {
        if (dbUser) {
          setUser(dbUser);
          setStoredUser(dbUser); // Mettre à jour les données locales
        } else {
          clearStoredUser();
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login : créer ou récupérer l'utilisateur
  const login = useCallback(async (email: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const dbUser = await getOrCreateUser(email.toLowerCase().trim());
      if (dbUser) {
        setUser(dbUser);
        setStoredUser(dbUser);
      }
      return dbUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  // Rafraîchir les données utilisateur depuis la BDD
  const refreshUser = useCallback(async () => {
    if (!user?.email) return;
    
    const dbUser = await getUserByEmail(user.email);
    if (dbUser) {
      setUser(dbUser);
      setStoredUser(dbUser);
    }
  }, [user?.email]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
