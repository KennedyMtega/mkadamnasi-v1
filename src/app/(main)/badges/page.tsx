'use client';

import { useState, useEffect, useCallback } from 'react';
import { Award, Lock, Filter } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Chip from '@/components/ui/Chip';
import ProgressBar from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';

interface BadgeItem {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  targetValue: number;
  pointsReward: number;
  isEarned: boolean;
  earnedAt: string | null;
  currentProgress: number;
}

type FilterType = 'all' | 'earned' | 'locked';

const CATEGORY_LABELS: Record<string, string> = {
  achievement: 'Mafanikio',
  milestone: 'Hatua',
  special: 'Maalum',
};

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [earnedCount, setEarnedCount] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getBadges();
      setBadges(res.data.badges);
      setEarnedCount(res.data.earnedCount);
      setTotalBadges(res.data.totalBadges);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo limetokea');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'earned') return badge.isEarned;
    if (filter === 'locked') return !badge.isEarned;
    return true;
  });

  // Group by category
  const groupedBadges: Record<string, BadgeItem[]> = {};
  for (const badge of filteredBadges) {
    if (!groupedBadges[badge.category]) {
      groupedBadges[badge.category] = [];
    }
    groupedBadges[badge.category].push(badge);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Beji" showBack />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Beji na Mafanikio</h1>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : error ? (
          <Card className="text-center py-8">
            <p className="text-semantic-error font-medium">Tatizo limetokea</p>
            <p className="text-sm text-neutral-500 mt-1">{error}</p>
            <button
              onClick={fetchBadges}
              className="text-brand-primary text-sm font-medium mt-2"
            >
              Jaribu tena
            </button>
          </Card>
        ) : (
          <>
            {/* Summary Card */}
            <Card elevated>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center">
                  <Award size={28} className="text-brand-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-neutral-900">
                    {earnedCount} / {totalBadges} Beji
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Endelea kushiriki ili kupata beji zaidi
                  </p>
                  <ProgressBar
                    value={earnedCount}
                    max={totalBadges || 1}
                    showPercentage
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <Chip
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                icon={<Filter size={14} />}
              >
                Zote ({totalBadges})
              </Chip>
              <Chip
                active={filter === 'earned'}
                onClick={() => setFilter('earned')}
                icon={<Award size={14} />}
              >
                Zilizopatikana ({earnedCount})
              </Chip>
              <Chip
                active={filter === 'locked'}
                onClick={() => setFilter('locked')}
                icon={<Lock size={14} />}
              >
                Zimefungwa ({totalBadges - earnedCount})
              </Chip>
            </div>

            {/* Badges grouped by category */}
            {Object.keys(groupedBadges).length === 0 ? (
              <Card className="text-center py-8">
                <Award size={40} className="text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-700 font-medium">
                  {filter === 'earned'
                    ? 'Bado huna beji'
                    : filter === 'locked'
                    ? 'Umepata beji zote!'
                    : 'Hakuna beji'}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  {filter === 'earned'
                    ? 'Endelea kupiga kura na kukadiria ili kupata beji'
                    : filter === 'locked'
                    ? 'Hongera kwa mafanikio yako!'
                    : ''}
                </p>
              </Card>
            ) : (
              Object.entries(groupedBadges).map(([category, categoryBadges]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-2 px-1 flex items-center gap-1.5">
                    {CATEGORY_LABELS[category] || category}
                    <Badge variant="default" size="sm">{categoryBadges.length}</Badge>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryBadges.map((badge) => (
                      <Card
                        key={badge.id}
                        className={!badge.isEarned ? 'opacity-60' : ''}
                      >
                        <div className="text-center space-y-2">
                          <div className="relative inline-block">
                            <span className={`text-4xl ${!badge.isEarned ? 'grayscale' : ''}`}>
                              {badge.icon}
                            </span>
                            {!badge.isEarned && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-neutral-300 flex items-center justify-center">
                                <Lock size={10} className="text-neutral-600" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{badge.name}</p>
                            <p className="text-[10px] text-neutral-500">{badge.nameEn}</p>
                          </div>

                          <p className="text-xs text-neutral-600">{badge.requirement}</p>

                          {badge.isEarned ? (
                            <>
                              <Badge variant="success" size="sm">Umeipata</Badge>
                              {badge.earnedAt && (
                                <p className="text-[10px] text-neutral-400">
                                  {formatDate(badge.earnedAt)}
                                </p>
                              )}
                            </>
                          ) : (
                            <div className="space-y-1">
                              <ProgressBar
                                value={badge.currentProgress}
                                max={badge.targetValue}
                                size="sm"
                                color="var(--color-neutral-500)"
                              />
                              <p className="text-[10px] text-neutral-500">
                                {badge.currentProgress} / {badge.targetValue}
                              </p>
                            </div>
                          )}

                          <div className="pt-1">
                            <Badge
                              variant={badge.isEarned ? 'warning' : 'default'}
                              size="sm"
                            >
                              +{badge.pointsReward} pointi
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
