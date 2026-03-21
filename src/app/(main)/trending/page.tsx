'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Inbox } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Tabs from '@/components/ui/Tabs';
import Skeleton, { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import VoteCard from '@/components/vote/VoteCard';
import RatingCard from '@/components/rating/RatingCard';
import { api } from '@/lib/api-client';

interface VoteItem {
  id: string;
  title: string;
  type: string;
  totalVotes: number;
  endDate: string | null;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string; icon: string };
  region?: string | null;
}

interface RatingItem {
  id: string;
  title: string;
  entityName: string;
  averageRating: number;
  totalRatings: number;
  isFeatured: boolean;
  category: { name: string; icon: string };
  region?: string | null;
}

const TABS = [
  { id: 'votes', label: 'Kura (Votes)' },
  { id: 'ratings', label: 'Kadiria (Ratings)' },
];

const PAGE_SIZE = 10;

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState('votes');
  const [votes, setVotes] = useState<VoteItem[]>([]);
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [votesOffset, setVotesOffset] = useState(0);
  const [ratingsOffset, setRatingsOffset] = useState(0);
  const [votesTotal, setVotesTotal] = useState(0);
  const [ratingsTotal, setRatingsTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [votesRes, ratingsRes] = await Promise.all([
        api.getVotes({ limit: String(PAGE_SIZE), offset: '0' }).catch(() => ({ data: [], total: 0 })),
        api.getRatings({ limit: String(PAGE_SIZE), offset: '0' }).catch(() => ({ data: [], total: 0 })),
      ]);

      setVotes(votesRes.data || []);
      setVotesTotal(votesRes.total || 0);
      setVotesOffset(PAGE_SIZE);

      setRatings(ratingsRes.data || []);
      setRatingsTotal(ratingsRes.total || 0);
      setRatingsOffset(PAGE_SIZE);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMoreVotes = async () => {
    setLoadingMore(true);
    try {
      const res = await api.getVotes({ limit: String(PAGE_SIZE), offset: String(votesOffset) });
      setVotes(prev => [...prev, ...(res.data || [])]);
      setVotesOffset(prev => prev + PAGE_SIZE);
    } catch { /* ignore */ }
    setLoadingMore(false);
  };

  const loadMoreRatings = async () => {
    setLoadingMore(true);
    try {
      const res = await api.getRatings({ limit: String(PAGE_SIZE), offset: String(ratingsOffset) });
      setRatings(prev => [...prev, ...(res.data || [])]);
      setRatingsOffset(prev => prev + PAGE_SIZE);
    } catch { /* ignore */ }
    setLoadingMore(false);
  };

  const hasMoreVotes = votesOffset < votesTotal;
  const hasMoreRatings = ratingsOffset < ratingsTotal;

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Vinavyotrendi" showBack />

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
            <TrendingUp size={20} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Vinavyotrendi (Trending)</h1>
            <p className="text-neutral-700 text-sm">Kura na makadirio maarufu zaidi</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={fetchData} />
        ) : activeTab === 'votes' ? (
          votes.length === 0 ? (
            <EmptyState
              icon={<Inbox size={32} />}
              title="Hakuna kura bado"
              description="Kura zinazotrendi zitaonekana hapa."
            />
          ) : (
            <div className="space-y-3">
              {votes.map((vote) => (
                <VoteCard
                  key={vote.id}
                  id={vote.id}
                  title={vote.title}
                  type={vote.type}
                  totalVotes={vote.totalVotes}
                  endDate={vote.endDate}
                  isActive={vote.isActive}
                  isFeatured={vote.isFeatured}
                  category={vote.category}
                  region={vote.region}
                />
              ))}
              {hasMoreVotes && (
                <button
                  onClick={loadMoreVotes}
                  disabled={loadingMore}
                  className="w-full py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary-light rounded-xl transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Inapakia...' : 'Pakia zaidi'}
                </button>
              )}
            </div>
          )
        ) : (
          ratings.length === 0 ? (
            <EmptyState
              icon={<Inbox size={32} />}
              title="Hakuna makadirio bado"
              description="Makadirio ya juu yataonekana hapa."
            />
          ) : (
            <div className="space-y-3">
              {ratings.map((rating) => (
                <RatingCard
                  key={rating.id}
                  id={rating.id}
                  title={rating.title}
                  entityName={rating.entityName}
                  averageRating={rating.averageRating}
                  totalRatings={rating.totalRatings}
                  isFeatured={rating.isFeatured}
                  category={rating.category}
                  region={rating.region}
                />
              ))}
              {hasMoreRatings && (
                <button
                  onClick={loadMoreRatings}
                  disabled={loadingMore}
                  className="w-full py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary-light rounded-xl transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Inapakia...' : 'Pakia zaidi'}
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
