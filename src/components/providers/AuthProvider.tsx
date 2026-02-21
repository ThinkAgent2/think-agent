'use client';

import { useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';
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
  const supabase = useMemo(() => createClient(), []);
  const lastAuthIdRef = useRef<string | null>(null);

  const loadUser = useCallback(async (authId: string | null, force = false) => {
    if (!force && authId === lastAuthIdRef.current) {
      return;
    }

    lastAuthIdRef.current = authId;

    if (!authId) {
      setUser(null);
      return;
    }

    const dbUser = await getUserByAuthId(authId);
    setUser(dbUser);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 3000);

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        const authId = data.session?.user?.id ?? null;
        if (!isMounted) return;
        await loadUser(authId);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const authId = session?.user?.id ?? null;
        await loadUser(authId);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [supabase, loadUser]);

  const login = useCallback(async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const locale = window.location.pathname.split('/')[1] || 'fr';
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: `${siteUrl}/${locale}/auth/callback`,
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
    await loadUser(authId, true);
  }, [supabase, loadUser]);

  useEffect(() => {
    async function handleVisibility() {
      if (document.visibilityState === 'visible') {
        await refreshUser();
      }
    }

    async function handleFocus() {
      await refreshUser();
    }

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
