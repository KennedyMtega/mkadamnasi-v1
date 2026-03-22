'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAnonymousId } from '@/lib/utils';

interface CommentUser {
  id: string;
  username: string | null;
  avatarUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  voteId: string | null;
  ratingId: string | null;
  parentId: string | null;
  isAnonymous: boolean;
  status: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
  replies: Comment[];
}

interface UseCommentsReturn {
  comments: Comment[];
  total: number;
  isLoading: boolean;
  error: string | null;
  addComment: (content: string, parentId?: string) => Promise<boolean>;
  deleteComment: (id: string) => Promise<boolean>;
  likeComment: (id: string) => Promise<boolean>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const LIMIT = 20;

export function useComments(targetId: string, targetType: 'vote' | 'rating'): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const anonymousId = getAnonymousId();
    if (anonymousId) headers['x-anonymous-id'] = anonymousId;
    return headers;
  }, []);

  const fetchComments = useCallback(async (newOffset = 0) => {
    if (!targetId) return;
    try {
      if (newOffset === 0) setIsLoading(true);
      setError(null);

      const paramKey = targetType === 'vote' ? 'voteId' : 'ratingId';
      const params = new URLSearchParams({
        [paramKey]: targetId,
        limit: String(LIMIT),
        offset: String(newOffset),
      });

      const res = await fetch(`/api/comments?${params}`, { headers: getHeaders() });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Tatizo la kupakia maoni.');

      if (newOffset === 0) {
        setComments(data.data);
      } else {
        setComments((prev) => [...prev, ...data.data]);
      }
      setTotal(data.total);
      setOffset(newOffset);
      setHasMore(newOffset + data.data.length < data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia maoni.');
    } finally {
      setIsLoading(false);
    }
  }, [targetId, targetType, getHeaders]);

  useEffect(() => {
    fetchComments(0);
  }, [fetchComments]);

  const loadMore = useCallback(async () => {
    await fetchComments(offset + LIMIT);
  }, [fetchComments, offset]);

  const addComment = useCallback(async (content: string, parentId?: string): Promise<boolean> => {
    try {
      setError(null);
      const body: Record<string, unknown> = {
        content,
        isAnonymous: true,
      };

      if (targetType === 'vote') body.voteId = targetId;
      else body.ratingId = targetId;

      if (parentId) body.parentId = parentId;

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Tatizo la kutuma maoni.');

      const newComment = data.data;

      if (parentId) {
        // Add reply to parent comment
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, newComment] }
              : c
          )
        );
      } else {
        // Add new top-level comment
        setComments((prev) => [newComment, ...prev]);
        setTotal((prev) => prev + 1);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kutuma maoni.');
      return false;
    }
  }, [targetId, targetType, getHeaders]);

  const deleteComment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Tatizo la kufuta maoni.');

      // Remove from local state
      setComments((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            replies: c.replies.filter((r) => r.id !== id),
          }))
      );
      setTotal((prev) => prev - 1);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kufuta maoni.');
      return false;
    }
  }, [getHeaders]);

  const likeComment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'like' }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Tatizo la kupenda maoni.');

      // Update likes count locally
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === id) return { ...c, likesCount: c.likesCount + 1 };
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id ? { ...r, likesCount: r.likesCount + 1 } : r
            ),
          };
        })
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupenda maoni.');
      return false;
    }
  }, [getHeaders]);

  return {
    comments,
    total,
    isLoading,
    error,
    addComment,
    deleteComment,
    likeComment,
    loadMore,
    hasMore,
  };
}
