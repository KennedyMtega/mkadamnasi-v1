'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface UserProfile {
  id: string;
  username: string | null;
  bio: string | null;
  region: string | null;
  language: string;
  points: number;
  level: number;
  streak: number;
  isPremium: boolean;
  isVerified: boolean;
  avatarUrl: string | null;
  lastActiveAt: string | null;
  createdAt: string;
}

interface UserStats {
  votesCast: number;
  ratingsGiven: number;
  votesCreated: number;
  ratingsCreated: number;
  points: number;
  level: number;
  nextLevelPoints: number;
  streak: number;
  badgesEarned: number;
  badges: Array<{
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    description: string;
    earnedAt: string;
  }>;
}

interface UseProfileReturn {
  profile: UserProfile | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateProfile: (data: {
    username?: string;
    bio?: string;
    region?: string;
    language?: string;
  }) => Promise<boolean>;
  refetch: () => void;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileResult, statsResult] = await Promise.all([
        api.getUserProfile(),
        api.getUserStats(),
      ]);

      setProfile(profileResult.data);
      setStats(statsResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia wasifu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data: {
    username?: string;
    bio?: string;
    region?: string;
    language?: string;
  }): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      const result = await api.updateUserProfile(data);
      setProfile(result.data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kusasisha wasifu.');
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    profile,
    stats,
    loading,
    error,
    updating,
    updateProfile,
    refetch: fetchProfile,
  };
}
