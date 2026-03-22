'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import SearchInput from '@/components/ui/SearchInput';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/lib/constants';
import { useSearch } from '@/features/search/hooks/useSearch';

const recentSearches = ['Mgahawa bora', 'UDSM', 'Boda boda', 'Saluni Mwanza'];
const trendingSearches = ['Jiji bora 2026', 'Hospitali bora', 'Mwanafunzi bora', 'Influencer mkubwa'];

export default function SearchPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'vote' | 'rating'>('all');

  const { query, setQuery, results, total, loading, hasMore, loadMore } = useSearch({
    type: activeFilter === 'all' ? 'all' : activeFilter,
    debounceMs: 300,
  });

  const hasQuery = query.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Tafuta" />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Tafuta</h1>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        <SearchInput
          placeholder="Tafuta kura, kadirio, biashara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          autoFocus
        />

        {/* Filter chips */}
        <div className="flex gap-2">
          <Chip active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>Zote</Chip>
          <Chip active={activeFilter === 'vote'} onClick={() => setActiveFilter('vote')}>Kura</Chip>
          <Chip active={activeFilter === 'rating'} onClick={() => setActiveFilter('rating')}>Makadirio</Chip>
        </div>

        {!hasQuery ? (
          <>
            {/* Recent Searches */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
                <Clock size={14} /> Utafutaji wa Hivi Karibuni
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm text-neutral-700 hover:bg-neutral-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-brand-primary" /> Inatrendi
              </h3>
              <div className="space-y-2">
                {trendingSearches.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <span className="text-sm font-bold text-brand-primary w-6">#{i + 1}</span>
                    <span className="text-sm text-neutral-900">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Categories */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">Vinjari kwa Kategoria</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.id}`}>
                    <Card padding="sm" className="flex items-center gap-2.5 hover:border-brand-primary transition-colors">
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{cat.name}</p>
                        <p className="text-xs text-neutral-500">{cat.nameEn}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Search Results */
          <div className="space-y-2.5">
            {loading && results.length === 0 ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-neutral-0 rounded-2xl border border-neutral-300 p-4 space-y-2">
                    <div className="flex gap-2">
                      <Skeleton className="w-16 h-5" />
                      <Skeleton className="w-12 h-5" />
                    </div>
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-1/3 h-3" />
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-neutral-700 font-medium">Hakuna matokeo</p>
                <p className="text-sm text-neutral-500 mt-1">
                  Jaribu maneno mengine ya kutafuta
                </p>
              </Card>
            ) : (
              <>
                <p className="text-xs text-neutral-500">
                  {total} matokeo kwa &quot;{query}&quot;
                </p>
                {results.map((result) => (
                  <Link key={`${result.type}-${result.id}`} href={`/${result.type === 'vote' ? 'vote' : 'rate'}/${result.id}`}>
                    <Card className="hover:border-brand-primary transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={result.type === 'vote' ? 'orange' : 'info'} size="sm">
                              {result.type === 'vote' ? 'Kura' : 'Kadirio'}
                            </Badge>
                            <Badge size="sm">
                              {result.category.icon} {result.category.name}
                            </Badge>
                          </div>
                          <h3 className="text-sm font-semibold text-neutral-900">{result.title}</h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Users size={12} /> {result.participants.toLocaleString()}
                            </span>
                            {result.averageRating !== undefined && result.averageRating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star size={12} className="text-semantic-warning" fill="var(--color-semantic-warning)" />
                                {result.averageRating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}

                {hasMore && (
                  <button
                    onClick={loadMore}
                    className="w-full py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary-light rounded-xl transition-colors"
                  >
                    Pakia zaidi
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
