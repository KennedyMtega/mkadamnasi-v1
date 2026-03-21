'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Star, Clock } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api-client';
import { formatNumber } from '@/lib/utils';

interface VoteItem {
  id: string;
  title: string;
  totalVotes: number;
  isActive: boolean;
  endDate: string | null;
  createdAt: string;
}

interface RatingItem {
  id: string;
  title: string;
  entityName: string;
  totalRatings: number;
  averageRating: number;
  isActive: boolean;
  createdAt: string;
}

type CombinedItem = {
  id: string;
  type: 'vote' | 'rating';
  title: string;
  participants: number;
  isActive: boolean;
  timeLeft?: string;
  rating?: number;
  createdAt: string;
};

function getTimeLeft(endDate: string | null): string | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Imeisha';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `Siku ${days}`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `Saa ${hours}`;
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [filter, setFilter] = useState<'all' | 'votes' | 'ratings'>('all');
  const [sort, setSort] = useState<'popular' | 'newest'>('popular');
  const [items, setItems] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find(c => c.id === id);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const [votesRes, ratingsRes] = await Promise.all([
          api.getVotes({ categoryId: id as string }).catch(() => ({ data: [] })),
          api.getRatings({ categoryId: id as string }).catch(() => ({ data: [] })),
        ]);

        const voteItems: CombinedItem[] = (votesRes.data || []).map((v: VoteItem) => ({
          id: v.id,
          type: 'vote' as const,
          title: v.title,
          participants: v.totalVotes,
          isActive: v.isActive,
          timeLeft: getTimeLeft(v.endDate),
          createdAt: v.createdAt,
        }));

        const ratingItems: CombinedItem[] = (ratingsRes.data || []).map((r: RatingItem) => ({
          id: r.id,
          type: 'rating' as const,
          title: r.entityName || r.title,
          participants: r.totalRatings,
          isActive: r.isActive,
          rating: r.averageRating,
          createdAt: r.createdAt,
        }));

        setItems([...voteItems, ...ratingItems]);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (!category) return <div className="p-8 text-center text-neutral-500">Kategoria haijapatikana</div>;

  const filtered = items.filter(item => {
    if (filter === 'votes') return item.type === 'vote';
    if (filter === 'ratings') return item.type === 'rating';
    return true;
  }).sort((a, b) => {
    if (sort === 'popular') return b.participants - a.participants;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-500">Hakuna matokeo katika kategoria hii bado.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((item) => (
              <Link key={`${item.type}-${item.id}`} href={`/${item.type === 'vote' ? 'vote' : 'rate'}/${item.id}`}>
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
                    <span className="flex items-center gap-1"><Users size={12} /> {formatNumber(item.participants)}</span>
                    {item.type === 'vote' && item.timeLeft && (
                      <span className="flex items-center gap-1"><Clock size={12} /> {item.timeLeft}</span>
                    )}
                    {item.type === 'rating' && item.rating !== undefined && (
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-semantic-warning" fill="var(--color-semantic-warning)" /> {item.rating.toFixed(1)}
                      </span>
                    )}
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
