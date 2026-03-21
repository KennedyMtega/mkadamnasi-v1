'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface VoteOption {
  id: string;
  title: string;
  voteCount: number;
  percentage: number;
  position: number;
}

interface Vote {
  id: string;
  title: string;
  description: string | null;
  type: string;
  totalVotes: number;
  viewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  endDate: string | null;
  region: string | null;
  createdAt: string;
  options: VoteOption[];
  category: {
    id: string;
    name: string;
    icon: string;
    slug: string;
  };
}

interface UseVotesParams {
  categoryId?: string;
  region?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

interface UseVotesReturn {
  votes: Vote[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useVotes(params?: UseVotesParams): UseVotesReturn {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(params?.offset ?? 0);

  const limit = params?.limit ?? 20;

  const fetchVotes = useCallback(async (appendMode = false) => {
    try {
      if (!appendMode) setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};
      if (params?.categoryId) queryParams.categoryId = params.categoryId;
      if (params?.region) queryParams.region = params.region;
      if (params?.featured) queryParams.featured = 'true';
      queryParams.limit = String(limit);
      queryParams.offset = String(appendMode ? offset : 0);

      const result = await api.getVotes(queryParams);

      if (appendMode) {
        setVotes((prev) => [...prev, ...result.data]);
      } else {
        setVotes(result.data);
      }
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia kura.');
    } finally {
      setLoading(false);
    }
  }, [params?.categoryId, params?.region, params?.featured, limit, offset]);

  useEffect(() => {
    setOffset(0);
    fetchVotes(false);
  }, [params?.categoryId, params?.region, params?.featured]);

  const refetch = useCallback(() => {
    setOffset(0);
    fetchVotes(false);
  }, [fetchVotes]);

  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchVotes(true);
  }, [offset, limit, fetchVotes]);

  return {
    votes,
    total,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: votes.length < total,
  };
}
