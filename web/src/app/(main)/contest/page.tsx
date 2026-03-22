'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Inbox, Filter } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Skeleton, { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import ContestCard from '@/features/contest/components/ContestCard';
import { getAnonymousId } from '@/lib/utils';

interface ContestItem {
  id: string;
  title: string;
  imageUrl: string | null;
  category: { name: string; icon?: string };
  totalVotes: number;
  contestantCount: number;
  endDate: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';
const PAGE_SIZE = 12;

export default function ContestListingPage() {
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const anonymousId = getAnonymousId();
    if (anonymousId) headers['x-anonymous-id'] = anonymousId;
    return headers;
  }, []);

  const fetchContests = useCallback(async (category?: string) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: '0' });
      if (category) params.set('category', category);

      const res = await fetch(`${BASE_URL}/api/contests?${params}`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error();

      setContests(data.data || []);
      setTotal(data.total || 0);
      setOffset(PAGE_SIZE);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/categories`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) setCategories(data.data || []);
    } catch { /* ignore */ }
  }, [getHeaders]);

  useEffect(() => {
    fetchContests();
    fetchCategories();
  }, [fetchContests, fetchCategories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchContests(category || undefined);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
      if (selectedCategory) params.set('category', selectedCategory);

      const res = await fetch(`${BASE_URL}/api/contests?${params}`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setContests(prev => [...prev, ...(data.data || [])]);
        setOffset(prev => prev + PAGE_SIZE);
      }
    } catch { /* ignore */ }
    setLoadingMore(false);
  };

  const hasMore = offset < total;

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Mashindano" showBack />

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
            <Trophy size={20} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Mashindano (Contests)</h1>
            <p className="text-neutral-700 text-sm">Shiriki na upige kura kwa washiriki unaowapenda</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {/* Hero Section - Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center gap-3 mb-1">
            <Trophy size={20} className="text-brand-primary" />
            <h1 className="text-xl font-bold text-neutral-900">Mashindano (Contests)</h1>
          </div>
          <p className="text-sm text-neutral-700">Shiriki na upige kura kwa washiriki unaowapenda (Participate and vote for your favorite contestants)</p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange('')}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                selectedCategory === ''
                  ? 'bg-brand-primary text-neutral-0'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Zote (All)
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-brand-primary text-neutral-0'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-neutral-0 rounded-2xl border border-neutral-300 overflow-hidden">
                <Skeleton className="h-36 rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton variant="rectangular" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-3/4 h-5" />
                  <div className="flex items-center gap-3">
                    <Skeleton variant="text" className="w-20 h-3" />
                    <Skeleton variant="text" className="w-16 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => fetchContests(selectedCategory || undefined)} />
        ) : contests.length === 0 ? (
          <EmptyState
            icon={<Inbox size={32} />}
            title="Hakuna mashindano bado (No contests yet)"
            description="Mashindano mapya yataonekana hapa. (New contests will appear here.)"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  id={contest.id}
                  title={contest.title}
                  imageUrl={contest.imageUrl}
                  totalVotes={contest.totalVotes}
                  contestantCount={contest.contestantCount}
                  endDate={contest.endDate}
                  category={contest.category}
                  isFeatured={contest.isFeatured}
                />
              ))}
            </div>
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary-light rounded-xl transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Inapakia... (Loading...)' : 'Pakia zaidi (Load more)'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
