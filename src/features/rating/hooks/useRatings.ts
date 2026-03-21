'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface RatingItem {
  id: string;
  title: string;
  description: string | null;
  entityName: string;
  entityType: string;
  averageRating: number;
  totalRatings: number;
  viewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  region: string | null;
  distribution: Record<string, number>;
  createdAt: string;
  category: {
    id: string;
    name: string;
    icon: string;
    slug: string;
  };
}

interface UseRatingsParams {
  categoryId?: string;
  region?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

interface UseRatingsReturn {
  ratings: RatingItem[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useRatings(params?: UseRatingsParams): UseRatingsReturn {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(params?.offset ?? 0);

  const limit = params?.limit ?? 20;

  const fetchRatings = useCallback(async (appendMode = false) => {
    try {
      if (!appendMode) setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};
      if (params?.categoryId) queryParams.categoryId = params.categoryId;
      if (params?.region) queryParams.region = params.region;
      if (params?.featured) queryParams.featured = 'true';
      queryParams.limit = String(limit);
      queryParams.offset = String(appendMode ? offset : 0);

      const result = await api.getRatings(queryParams);

      if (appendMode) {
        setRatings((prev) => [...prev, ...result.data]);
      } else {
        setRatings(result.data);
      }
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia makadirio.');
    } finally {
      setLoading(false);
    }
  }, [params?.categoryId, params?.region, params?.featured, limit, offset]);

  useEffect(() => {
    setOffset(0);
    fetchRatings(false);
  }, [params?.categoryId, params?.region, params?.featured]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    setOffset(0);
    fetchRatings(false);
  }, [fetchRatings]);

  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchRatings(true);
  }, [offset, limit, fetchRatings]);

  return {
    ratings,
    total,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: ratings.length < total,
  };
}
