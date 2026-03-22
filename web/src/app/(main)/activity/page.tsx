'use client';

import { useState } from 'react';
import { Bell, Vote, Star, Award, TrendingUp, Check, FileText } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { formatDate } from '@/lib/utils';

const ACTIVITY_ICONS: Record<string, { icon: typeof Vote; color: string; bg: string }> = {
  vote_cast: { icon: Vote, color: 'text-brand-primary', bg: 'bg-brand-primary-light' },
  vote_created: { icon: Vote, color: 'text-brand-primary', bg: 'bg-brand-primary-light' },
  rating_given: { icon: Star, color: 'text-semantic-warning', bg: 'bg-yellow-50' },
  rating_created: { icon: Star, color: 'text-semantic-warning', bg: 'bg-yellow-50' },
  badge_earned: { icon: Award, color: 'text-semantic-warning', bg: 'bg-yellow-50' },
  level_up: { icon: TrendingUp, color: 'text-semantic-success', bg: 'bg-emerald-50' },
  system: { icon: Bell, color: 'text-semantic-info', bg: 'bg-blue-50' },
};

const DEFAULT_ICON = { icon: FileText, color: 'text-neutral-500', bg: 'bg-neutral-100' };

export default function ActivityPage() {
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const { activities, total, unreadNotifications, loading, error, hasMore, loadMore } = useActivity({
    type: filter,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Shughuli" rightAction={
        <button className="p-2 rounded-xl hover:bg-neutral-100" aria-label="Soma zote">
          <Check size={20} className="text-neutral-700" />
        </button>
      } />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">Shughuli</h1>
          {unreadNotifications > 0 && (
            <Badge variant="error">{unreadNotifications} mpya</Badge>
          )}
        </div>
        <button className="text-sm font-medium text-brand-primary hover:underline">Soma zote</button>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Chip active={!filter} onClick={() => setFilter(undefined)}>
            Zote ({total})
          </Chip>
          <Chip active={filter === 'vote_cast'} onClick={() => setFilter(filter === 'vote_cast' ? undefined : 'vote_cast')}>
            Kura
          </Chip>
          <Chip active={filter === 'rating_given'} onClick={() => setFilter(filter === 'rating_given' ? undefined : 'rating_given')}>
            Makadirio
          </Chip>
          <Chip active={filter === 'badge_earned'} onClick={() => setFilter(filter === 'badge_earned' ? undefined : 'badge_earned')}>
            Beji
          </Chip>
        </div>

        {loading && activities.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-neutral-0 rounded-2xl border border-neutral-300 p-3 flex items-start gap-3">
                <Skeleton variant="rectangular" className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="w-48 h-4" />
                  <Skeleton className="w-64 h-3" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="text-center py-8">
            <p className="text-semantic-error font-medium">Tatizo limetokea</p>
            <p className="text-sm text-neutral-500 mt-1">{error}</p>
          </Card>
        ) : activities.length === 0 ? (
          <Card className="text-center py-12">
            <Bell size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-700 font-medium">Hakuna shughuli</p>
            <p className="text-sm text-neutral-500 mt-1">Shughuli zako zote zitaonekana hapa</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {activities.map((item) => {
              const iconConfig = ACTIVITY_ICONS[item.type] || DEFAULT_ICON;
              const Icon = iconConfig.icon;

              return (
                <Card
                  key={item.id}
                  padding="sm"
                  className="flex items-start gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${iconConfig.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={iconConfig.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-neutral-700 mt-0.5">{item.description}</p>
                    )}
                    <p className="text-xs text-neutral-500 mt-1">{formatDate(item.createdAt)}</p>
                  </div>
                </Card>
              );
            })}

            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary-light rounded-xl transition-colors"
              >
                Pakia zaidi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
