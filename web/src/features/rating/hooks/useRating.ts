'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

interface RatingEntry {
  id: string;
  score: number;
  review: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

interface RatingDetail {
  id: string;
  title: string;
  description: string | null;
  entityName: string;
  entityType: string;
  averageRating: number;
  totalRatings: number;
  viewCount: number;
  shareCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isAnonymous: boolean;
  region: string | null;
  distribution: Record<string, number>;
  createdAt: string;
  category: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    slug: string;
  };
  entries: RatingEntry[];
  userRating?: number | null;
}

interface UseRatingReturn {
  rating: RatingDetail | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitRating: (score: number, review?: string) => Promise<boolean>;
  refetch: () => void;
}

export function useRating(id: string): UseRatingReturn {
  const [rating, setRating] = useState<RatingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchRating = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await api.getRating(id);
      setRating(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kupakia kadirio.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const submitRating = useCallback(async (score: number, review?: string): Promise<boolean> => {
    if (!id) return false;
    try {
      setSubmitting(true);
      setError(null);
      const result = await api.submitRating(id, score, review);
      setRating(result.data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la kutuma kadirio.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [id]);

  return {
    rating,
    loading,
    error,
    submitting,
    submitRating,
    refetch: fetchRating,
  };
}
