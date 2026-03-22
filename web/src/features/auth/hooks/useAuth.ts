'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { getAnonymousId } from '@/lib/utils';

interface AnonymousUser {
  id: string;
  points: number;
  level: number;
  streak: number;
  isPremium: boolean;
  isRegistered: boolean;
  username: string | null;
  language: string;
}

interface UseAuthReturn {
  user: {
    id: string;
    email?: string | null;
    anonymousId: string;
    isAdmin: boolean;
    isPremium: boolean;
    username: string | null;
    points?: number;
    level?: number;
    streak?: number;
  } | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: {
    email?: string;
    phone?: string;
    password: string;
    username?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  ensureAnonymousUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | null>(null);
  const [anonLoading, setAnonLoading] = useState(false);

  const isSessionLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // Ensure anonymous user exists on mount when not authenticated
  const ensureAnonymousUser = useCallback(async () => {
    if (isAuthenticated || anonLoading) return;

    const anonymousId = getAnonymousId();
    if (!anonymousId) return;

    setAnonLoading(true);
    try {
      const response = await fetch('/api/auth/anonymous', {
        method: 'POST',
        headers: {
          'x-anonymous-id': anonymousId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnonymousUser(data.user);
      }
    } catch (error) {
      console.error('Failed to ensure anonymous user:', error);
    } finally {
      setAnonLoading(false);
    }
  }, [isAuthenticated, anonLoading]);

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      ensureAnonymousUser();
    }
  }, [isSessionLoading, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (login: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        login,
        password,
        redirect: false,
      });

      if (result?.error) {
        return {
          ok: false,
          error: result.error === 'CredentialsSignin'
            ? 'Barua pepe/nambari ya simu au nywila si sahihi'
            : result.error,
        };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: 'Hitilafu ya mtandao. Tafadhali jaribu tena.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    // Re-initialize anonymous user after logout
    setAnonymousUser(null);
    setTimeout(() => ensureAnonymousUser(), 100);
  }, [ensureAnonymousUser]);

  const register = useCallback(async (data: {
    email?: string;
    phone?: string;
    password: string;
    username?: string;
  }) => {
    try {
      const anonymousId = getAnonymousId();

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(anonymousId ? { 'x-anonymous-id': anonymousId } : {}),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { ok: false, error: result.error };
      }

      // Auto-login after successful registration
      const loginField = data.email || data.phone || '';
      const loginResult = await signIn('credentials', {
        login: loginField,
        password: data.password,
        redirect: false,
      });

      if (loginResult?.error) {
        // Registration succeeded but auto-login failed - user can login manually
        return { ok: true };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: 'Hitilafu ya mtandao. Tafadhali jaribu tena.' };
    }
  }, []);

  const user = useMemo(() => {
    if (isAuthenticated && session?.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        anonymousId: session.user.anonymousId,
        isAdmin: session.user.isAdmin,
        isPremium: session.user.isPremium,
        username: session.user.username,
      };
    }

    if (anonymousUser) {
      return {
        id: anonymousUser.id,
        anonymousId: getAnonymousId(),
        isAdmin: false,
        isPremium: anonymousUser.isPremium,
        username: anonymousUser.username,
        points: anonymousUser.points,
        level: anonymousUser.level,
        streak: anonymousUser.streak,
      };
    }

    return null;
  }, [isAuthenticated, session, anonymousUser]);

  return {
    user,
    isAuthenticated,
    isAnonymous: !isAuthenticated && !!anonymousUser,
    isLoading: isSessionLoading || anonLoading,
    login,
    logout,
    register,
    ensureAnonymousUser,
  };
}
