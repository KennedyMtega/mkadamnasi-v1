'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api-client';

interface SearchResult {
  id: string;
  type: 'vote' | 'rating';
  title: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  region: string | null;
  participants: number;
  averageRating?: number;
  createdAt: string;
}

interface UseSearchParams {
  debounceMs?: number;
  type?: 'vote' | 'rating' | 'all';
  categoryId?: string;
  region?: string;
  limit?: number;
}

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useSearch(params?: UseSearchParams): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const debounceMs = params?.debounceMs ?? 300;
  const limit = params?.limit ?? 20;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (searchQuery: string, searchOffset: number, append: boolean) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      if (!append) {
        setResults([]);
        setTotal(0);
      }
      setLoading(false);
      return;
    }

    try {
      if (!append) setLoading(true);
      setError(null);

      const result = await api.search({
        q: searchQuery.trim(),
        type: params?.type || 'all',
        categoryId: params?.categoryId,
        region: params?.region,
        limit,
        offset: searchOffset,
      });

      if (append) {
        setResults((prev) => [...prev, ...result.data]);
      } else {
        setResults(result.data);
      }
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kutafuta.');
    } finally {
      setLoading(false);
    }
  }, [params?.type, params?.categoryId, params?.region, limit]);

  // Debounced search on query change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query || query.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOffset(0);

    timerRef.current = setTimeout(() => {
      performSearch(query, 0, false);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs, performSearch]);

  // Re-search when filter params change
  useEffect(() => {
    if (query.trim().length >= 2) {
      setOffset(0);
      performSearch(query, 0, false);
    }
  }, [params?.type, params?.categoryId, params?.region]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    performSearch(query, newOffset, true);
  }, [offset, limit, query, performSearch]);

  return {
    query,
    setQuery,
    results,
    total,
    loading,
    error,
    hasMore: results.length < total,
    loadMore,
  };
}
