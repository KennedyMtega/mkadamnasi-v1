'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Filter,
} from 'lucide-react';

interface RatingOverview {
  averageRating: number;
  totalRatings: number;
  distribution: Record<string, number>;
  trend: number;
  recentReviews: Array<{
    id: string;
    score: number;
    review: string | null;
    createdAt: string;
    isAnonymous: boolean;
  }>;
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-12 shrink-0">
        <span className="text-sm font-medium text-neutral-700">{stars}</span>
        <Star size={14} className="text-semantic-warning fill-semantic-warning" />
      </div>
      <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-semantic-warning rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-neutral-500 w-10 text-right">{count}</span>
    </div>
  );
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'text-semantic-warning fill-semantic-warning' : 'text-neutral-300'}
        />
      ))}
    </div>
  );
}

export default function BusinessRatingsPage() {
  const [data, setData] = useState<RatingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterScore, setFilterScore] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const res = await fetch('/api/business/ratings');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // placeholder
      } finally {
        setLoading(false);
      }
    }
    fetchRatings();
  }, []);

  const overview = data || {
    averageRating: 0,
    totalRatings: 0,
    distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    trend: 0,
    recentReviews: [],
  };

  const filteredReviews = filterScore
    ? overview.recentReviews.filter((r) => r.score === filterScore)
    : overview.recentReviews;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tathmini (Ratings)</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Muhtasari wa tathmini za biashara yako. Overview of your business ratings.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main rating */}
        <Card padding="lg" className="lg:col-span-1">
          <div className="text-center">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="w-20 h-16 bg-neutral-100 rounded mx-auto" />
                <div className="w-32 h-5 bg-neutral-100 rounded mx-auto" />
              </div>
            ) : (
              <>
                <p className="text-5xl font-bold text-neutral-900">
                  {overview.averageRating.toFixed(1)}
                </p>
                <StarDisplay rating={overview.averageRating} size={24} />
                <p className="text-sm text-neutral-500 mt-2">
                  kutoka tathmini {overview.totalRatings.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500">
                  from {overview.totalRatings.toLocaleString()} ratings
                </p>
                {overview.trend !== 0 && (
                  <div className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                    overview.trend > 0 ? 'bg-semantic-success/10 text-semantic-success' : 'bg-semantic-error/10 text-semantic-error'
                  }`}>
                    {overview.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {overview.trend > 0 ? '+' : ''}{overview.trend.toFixed(1)} mwezi huu
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Distribution */}
        <Card padding="lg" className="lg:col-span-2">
          <h2 className="text-base font-bold text-neutral-900 mb-4">
            Ugawaji wa Tathmini (Rating Distribution)
          </h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-neutral-100 rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={overview.distribution[String(stars)] || 0}
                  total={overview.totalRatings}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent reviews */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-900">
            Maoni ya Hivi Karibuni (Recent Reviews)
          </h2>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-500" />
            <select
              value={filterScore || ''}
              onChange={(e) => setFilterScore(e.target.value ? parseInt(e.target.value) : null)}
              className="h-9 px-3 rounded-lg border border-neutral-300 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Zote (All)</option>
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>{s} Nyota ({s} Stars)</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse p-3 rounded-xl bg-neutral-100">
                <div className="h-4 w-24 bg-neutral-300/50 rounded mb-2" />
                <div className="h-3 w-full bg-neutral-300/50 rounded" />
              </div>
            ))}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={review.score} size={14} />
                    <span className="text-sm font-medium text-neutral-700">{review.score}/5</span>
                  </div>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(review.createdAt).toLocaleDateString('sw-TZ')}
                  </span>
                </div>
                {review.review ? (
                  <p className="text-sm text-neutral-700">{review.review}</p>
                ) : (
                  <p className="text-sm text-neutral-500 italic">Hakuna maoni (No comment)</p>
                )}
                {review.isAnonymous && (
                  <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                    <Users size={12} />
                    Mtumiaji asiyejulikana (Anonymous user)
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">
              Hakuna maoni bado. (No reviews yet.)
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
