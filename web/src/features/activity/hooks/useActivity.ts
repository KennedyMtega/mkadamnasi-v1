'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface UseActivityParams {
  type?: string;
  limit?: number;
}

interface UseActivityReturn {
  activities: ActivityItem[];
  total: number;
  unreadNotifications: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useActivity(params?: UseActivityParams): UseActivityReturn {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const limit = params?.limit ?? 20;

  const fetchActivity = useCallback(async (appendMode = false) => {
    try {
      if (!appendMode) setLoading(true);
      setError(null);

      const result = await api.getActivity({
        type: params?.type,
        limit,
        offset: appendMode ? offset : 0,
      });

      if (appendMode) {
        setActivities((prev) => [...prev, ...result.data]);
      } else {
        setActivities(result.data);
      }
      setTotal(result.total);
      setUnreadNotifications(result.unreadNotifications ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia shughuli.');
    } finally {
      setLoading(false);
    }
  }, [params?.type, limit, offset]);

  useEffect(() => {
    setOffset(0);
    fetchActivity(false);
  }, [params?.type]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    setOffset(0);
    fetchActivity(false);
  }, [fetchActivity]);

  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchActivity(true);
  }, [offset, limit, fetchActivity]);

  return {
    activities,
    total,
    unreadNotifications,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: activities.length < total,
  };
}
