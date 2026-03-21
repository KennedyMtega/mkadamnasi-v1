'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Star, Clock, Filter } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { CATEGORIES } from '@/lib/constants';

const mockItems = [
  { id: '1', type: 'vote' as const, title: 'Mgahawa Bora Dar es Salaam 2026', participants: 12453, timeLeft: 'Siku 3', isActive: true },
  { id: '2', type: 'rating' as const, title: 'Hyatt Regency Dar', participants: 2341, rating: 4.7, isActive: true },
  { id: '3', type: 'vote' as const, title: 'Pizza Bora - Dar es Salaam', participants: 3456, timeLeft: 'Siku 7', isActive: true },
  { id: '4', type: 'rating' as const, title: 'Samaki Samaki Restaurant', participants: 1890, rating: 4.2, isActive: true },
  { id: '5', type: 'vote' as const, title: 'Cafe Bora ya Kusoma', participants: 2100, timeLeft: 'Imeisha', isActive: false },
];

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [filter, setFilter] = useState<'all' | 'votes' | 'ratings'>('all');
  const [sort, setSort] = useState<'popular' | 'newest'>('popular');

  const category = CATEGORIES.find(c => c.id === id);
  if (!category) return <div className="p-8 text-center text-neutral-500">Kategoria haijapatikana</div>;

  const filtered = mockItems.filter(item => {
    if (filter === 'votes') return item.type === 'vote';
    if (filter === 'ratings') return item.type === 'rating';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title={category.name} showBack />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{category.name}</h1>
            <p className="text-neutral-700">{category.nameEn}</p>
          </div>
        </div>
      </div>

      {/* Mobile category header */}
      <div className="lg:hidden px-4 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <p className="text-sm text-neutral-500">{category.nameEn}</p>
            <p className="text-xs text-neutral-500">{filtered.length} vitu</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-3 space-y-3">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Zote</Chip>
            <Chip active={filter === 'votes'} onClick={() => setFilter('votes')}>Kura</Chip>
            <Chip active={filter === 'ratings'} onClick={() => setFilter('ratings')}>Makadirio</Chip>
          </div>
          <div className="flex gap-1.5">
            <Chip active={sort === 'popular'} onClick={() => setSort('popular')}>Maarufu</Chip>
            <Chip active={sort === 'newest'} onClick={() => setSort('newest')}>Mpya</Chip>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <Link key={item.id} href={`/${item.type === 'vote' ? 'vote' : 'rate'}/${item.id}`}>
              <Card className="hover:border-brand-primary transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={item.type === 'vote' ? 'orange' : 'info'} size="sm">
                    {item.type === 'vote' ? 'Kura' : 'Kadirio'}
                  </Badge>
                  {item.isActive ? (
                    <Badge variant="success" size="sm">Hai</Badge>
                  ) : (
                    <Badge size="sm">Imeisha</Badge>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {item.participants.toLocaleString()}</span>
                  {item.type === 'vote' && item.timeLeft && (
                    <span className="flex items-center gap-1"><Clock size={12} /> {item.timeLeft}</span>
                  )}
                  {item.type === 'rating' && item.rating && (
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-semantic-warning" fill="var(--color-semantic-warning)" /> {item.rating}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
