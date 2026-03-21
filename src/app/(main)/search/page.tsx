'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import SearchInput from '@/components/ui/SearchInput';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { CATEGORIES } from '@/lib/constants';

const recentSearches = ['Mgahawa bora', 'UDSM', 'Boda boda', 'Saluni Mwanza'];
const trendingSearches = ['Jiji bora 2026', 'Hospitali bora', 'Mwanafunzi bora', 'Influencer mkubwa'];

const mockResults = [
  { id: '1', type: 'vote' as const, title: 'Mgahawa Bora Dar 2026', category: 'Migahawa', participants: 12453 },
  { id: '2', type: 'rating' as const, title: 'Hyatt Regency Dar', category: 'Migahawa', participants: 2341, rating: 4.7 },
  { id: '3', type: 'vote' as const, title: 'Boda vs Bajaji — Usafiri Bora?', category: 'Usafiri', participants: 6234 },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'votes' | 'ratings'>('all');

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
          <Chip active={activeFilter === 'votes'} onClick={() => setActiveFilter('votes')}>Kura</Chip>
          <Chip active={activeFilter === 'ratings'} onClick={() => setActiveFilter('ratings')}>Makadirio</Chip>
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
            <p className="text-xs text-neutral-500">{mockResults.length} matokeo kwa &quot;{query}&quot;</p>
            {mockResults.map((result) => (
              <Link key={result.id} href={`/${result.type === 'vote' ? 'vote' : 'rate'}/${result.id}`}>
                <Card className="hover:border-brand-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={result.type === 'vote' ? 'orange' : 'info'} size="sm">
                          {result.type === 'vote' ? 'Kura' : 'Kadirio'}
                        </Badge>
                        <Badge size="sm">{result.category}</Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900">{result.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><Users size={12} /> {result.participants.toLocaleString()}</span>
                        {result.rating && (
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-semantic-warning" fill="var(--color-semantic-warning)" /> {result.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
