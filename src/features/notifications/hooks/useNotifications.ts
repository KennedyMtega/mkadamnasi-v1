'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

interface UseNotificationsParams {
  unreadOnly?: boolean;
  limit?: number;
}

interface UseNotificationsReturn {
  notifications: NotificationItem[];
  total: number;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
  refetch: () => void;
  loadMore: () => void;
  markAsRead: (ids: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export function useNotifications(params?: UseNotificationsParams): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = params?.limit ?? 20;

  const fetchNotifications = useCallback(async (pageNum: number, appendMode = false) => {
    try {
      if (!appendMode) setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {
        page: String(pageNum),
        limit: String(limit),
      };
      if (params?.unreadOnly) {
        queryParams.unread_only = 'true';
      }

      const result = await api.getNotifications(queryParams);

      if (appendMode) {
        setNotifications((prev) => [...prev, ...result.data]);
      } else {
        setNotifications(result.data);
      }
      setTotal(result.total);
      setUnreadCount(result.unreadCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia taarifa.');
    } finally {
      setLoading(false);
    }
  }, [params?.unreadOnly, limit]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(1, false);
  }, [params?.unreadOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    setPage(1);
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  }, [page, fetchNotifications]);

  const markAsRead = useCallback(async (ids: string[]) => {
    try {
      const result = await api.markNotificationsRead(ids);
      setUnreadCount(result.unreadCount);
      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const result = await api.markAllNotificationsRead();
      setUnreadCount(result.unreadCount);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  return {
    notifications,
    total,
    unreadCount,
    loading,
    error,
    page,
    totalPages,
    hasMore: page < totalPages,
    refetch,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
}
