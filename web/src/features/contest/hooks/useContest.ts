'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAnonymousId } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const anonymousId = getAnonymousId();
  if (anonymousId) {
    headers['x-anonymous-id'] = anonymousId;
  }
  return headers;
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Tatizo la seva');
  }
  return data;
}

export interface ContestItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: { name: string; icon?: string };
  totalVotes: number;
  contestantCount: number;
  endDate: string | null;
  startDate: string | null;
  isFeatured: boolean;
  isActive: boolean;
  boostEnabled: boolean;
  registrationOpen: boolean;
}

export interface Contestant {
  id: string;
  code: string;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  voteCount: number;
  percentage: number;
  rank: number;
}

export interface ContestDetail extends ContestItem {
  codePrefix: string;
  timeLeft: string | null;
  contestants: Contestant[];
  hasVoted: boolean;
  userVotedContestantId: string | null;
}

export function useContests(params?: { category?: string; limit?: number; offset?: number }) {
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = useCallback(async (overrideParams?: typeof params) => {
    setLoading(true);
    setError(null);
    try {
      const p = overrideParams || params || {};
      const searchParams = new URLSearchParams();
      if (p.category) searchParams.set('category', p.category);
      if (p.limit) searchParams.set('limit', String(p.limit));
      if (p.offset) searchParams.set('offset', String(p.offset));

      const res = await fetch(`${BASE_URL}/api/contests?${searchParams}`, {
        headers: getHeaders(),
      });
      const data = await handleResponse(res);
      setContests(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la seva');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const loadMore = async (offset: number, limit: number) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      searchParams.set('limit', String(limit));
      searchParams.set('offset', String(offset));

      const res = await fetch(`${BASE_URL}/api/contests?${searchParams}`, {
        headers: getHeaders(),
      });
      const data = await handleResponse(res);
      setContests(prev => [...prev, ...(data.data || [])]);
      return data.data?.length || 0;
    } catch {
      return 0;
    }
  };

  return { contests, total, loading, error, refetch: fetchContests, loadMore };
}

export function useContest(id: string) {
  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/contests/${id}`, {
        headers: getHeaders(),
      });
      const data = await handleResponse(res);
      setContest(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la seva');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchContest();
  }, [id, fetchContest]);

  return { contest, loading, error, refetch: fetchContest, setContest };
}
