'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext } from '@/lib/auth';
import { getUserByAuthId } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types/database';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadUser = useCallback(async (authId: string | null) => {
    if (!authId) {
      setUser(null);
      return;
    }
    const dbUser = await getUserByAuthId(authId);
    setUser(dbUser);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      const authId = data.session?.user?.id ?? null;
      if (!isMounted) return;
      await loadUser(authId);
      setIsLoading(false);
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authId = session?.user?.id ?? null;
      await loadUser(authId);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase, loadUser]);

  const login = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const authId = data.session?.user?.id ?? null;
    await loadUser(authId);
  }, [supabase, loadUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
