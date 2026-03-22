'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface VoteOption {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  voteCount: number;
  percentage: number;
  position: number;
}

interface VoteDetail {
  id: string;
  title: string;
  description: string | null;
  type: string;
  totalVotes: number;
  viewCount: number;
  shareCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isAnonymous: boolean;
  endDate: string | null;
  region: string | null;
  createdAt: string;
  options: VoteOption[];
  category: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    slug: string;
  };
  userVote?: string | null;
}

interface UseVoteReturn {
  vote: VoteDetail | null;
  loading: boolean;
  error: string | null;
  casting: boolean;
  castVote: (optionId: string) => Promise<boolean>;
  refetch: () => void;
}

export function useVote(id: string): UseVoteReturn {
  const [vote, setVote] = useState<VoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [casting, setCasting] = useState(false);

  const fetchVote = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await api.getVote(id);
      setVote(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia kura.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVote();
  }, [fetchVote]);

  const castVote = useCallback(async (optionId: string): Promise<boolean> => {
    if (!id) return false;
    try {
      setCasting(true);
      setError(null);
      const result = await api.castVote(id, optionId);
      setVote(result.data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupiga kura.');
      return false;
    } finally {
      setCasting(false);
    }
  }, [id]);

  return {
    vote,
    loading,
    error,
    casting,
    castVote,
    refetch: fetchVote,
  };
}
