'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Trophy, Medal, Award, Inbox } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Tabs from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { formatNumber } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  anonymousId: string;
  points: number;
  level: number;
  badgeCount: number;
}

const TABS = [
  { id: 'weekly', label: 'Wiki (Weekly)' },
  { id: 'all', label: 'Jumla (All Time)' },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy size={20} className="text-amber-500" />;
  if (rank === 2) return <Medal size={20} className="text-neutral-400" />;
  if (rank === 3) return <Medal size={20} className="text-amber-700" />;
  return null;
}

function getRankBg(rank: number): string {
  if (rank === 1) return 'bg-amber-50 border-amber-200';
  if (rank === 2) return 'bg-neutral-50 border-neutral-300';
  if (rank === 3) return 'bg-orange-50 border-orange-200';
  return '';
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLeaderboard = useCallback(async (period: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/leaderboard?period=${period}&limit=50`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setEntries(data.data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab, fetchLeaderboard]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Ubao wa Washindi" showBack />

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
            <BarChart3 size={20} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Ubao wa Washindi (Leaderboard)</h1>
            <p className="text-neutral-700 text-sm">Watumiaji bora kwa pointi</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-neutral-0 rounded-2xl border border-neutral-300 p-4 flex items-center gap-3">
                <Skeleton variant="circular" className="w-8 h-8" />
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-24 h-4" />
                  <Skeleton variant="text" className="w-16 h-3" />
                </div>
                <Skeleton variant="text" className="w-16 h-5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => fetchLeaderboard(activeTab)} />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={<Inbox size={32} />}
            title="Hakuna data bado"
            description={activeTab === 'weekly' ? 'Hakuna watumiaji waliofanya shughuli wiki hii.' : 'Ubao wa washindi utajazwa hivi karibuni.'}
          />
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <Card
                key={entry.rank}
                padding="sm"
                className={getRankBg(entry.rank)}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {getRankIcon(entry.rank) || (
                      <span className="text-sm font-bold text-neutral-500">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar anonymous size="sm" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {entry.anonymousId}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="orange" size="sm">Ngazi {entry.level}</Badge>
                      {entry.badgeCount > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                          <Award size={12} /> {entry.badgeCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-brand-primary">{formatNumber(entry.points)}</p>
                    <p className="text-[10px] text-neutral-500">pointi</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
