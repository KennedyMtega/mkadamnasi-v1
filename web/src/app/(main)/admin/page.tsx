'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { getAnonymousId } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import {
  Users,
  Vote,
  Star,
  Flag,
  TrendingUp,
  Crown,
  Ban,
  PlusCircle,
  FolderTree,
  BarChart3,
  Activity,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeVotes: number;
  activeRatings: number;
  pendingReports: number;
  bannedUsers: number;
  premiumUsers: number;
  totalVoteEntries: number;
  totalRatingEntries: number;
  weeklyStats: {
    newUsers: number;
    newVotes: number;
    newRatings: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-anonymous-id': getAnonymousId() },
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return <ErrorState onRetry={fetchStats} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Dashibodi ya Admin (Admin Dashboard)
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Muhtasari wa jukwaa la Mkadamnasi (Platform overview)
        </p>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="w-8 h-8 mb-3" variant="circular" />
              <Skeleton className="w-20 h-6 mb-1" variant="text" />
              <Skeleton className="w-16 h-4" variant="text" />
            </Card>
          ))
        ) : stats ? (
          <>
            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <Users size={20} className="text-semantic-info" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatNumber(stats.totalUsers)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Watumiaji Wote (Total Users)
              </p>
              {stats.weeklyStats.newUsers > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={12} className="text-semantic-success" />
                  <span className="text-xs text-semantic-success font-medium">
                    +{stats.weeklyStats.newUsers} wiki hii
                  </span>
                </div>
              )}
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <Vote size={20} className="text-semantic-success" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatNumber(stats.activeVotes)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Kura Hai (Active Votes)
              </p>
              {stats.weeklyStats.newVotes > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={12} className="text-semantic-success" />
                  <span className="text-xs text-semantic-success font-medium">
                    +{stats.weeklyStats.newVotes} wiki hii
                  </span>
                </div>
              )}
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                <Star size={20} className="text-semantic-warning" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatNumber(stats.activeRatings)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Tathmini Hai (Active Ratings)
              </p>
              {stats.weeklyStats.newRatings > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={12} className="text-semantic-success" />
                  <span className="text-xs text-semantic-success font-medium">
                    +{stats.weeklyStats.newRatings} wiki hii
                  </span>
                </div>
              )}
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                <Flag size={20} className="text-semantic-error" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatNumber(stats.pendingReports)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Ripoti Zinazosubiri (Pending Reports)
              </p>
              {stats.pendingReports > 0 && (
                <Link
                  href="/admin/reports"
                  className="text-xs text-semantic-error font-medium mt-2 inline-block hover:underline"
                >
                  Angalia sasa &rarr;
                </Link>
              )}
            </Card>
          </>
        ) : null}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="sm">
              <Skeleton className="w-full h-10" variant="rectangular" />
            </Card>
          ))
        ) : stats ? (
          <>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Crown size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900">{formatNumber(stats.premiumUsers)}</p>
                  <p className="text-[11px] text-neutral-500">Premium</p>
                </div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <Ban size={16} className="text-semantic-error" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900">{formatNumber(stats.bannedUsers)}</p>
                  <p className="text-[11px] text-neutral-500">Waliozuiwa (Banned)</p>
                </div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <BarChart3 size={16} className="text-semantic-success" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900">{formatNumber(stats.totalVoteEntries)}</p>
                  <p className="text-[11px] text-neutral-500">Kura Zilizopigwa (Votes Cast)</p>
                </div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Activity size={16} className="text-semantic-warning" />
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-900">{formatNumber(stats.totalRatingEntries)}</p>
                  <p className="text-[11px] text-neutral-500">Tathmini Zilizotolewa (Ratings Given)</p>
                </div>
              </div>
            </Card>
          </>
        ) : null}
      </div>

      {/* Revenue & Moderation row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <BarChart3 size={16} className="text-semantic-success" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">TZS 2.4M</p>
              <p className="text-[11px] text-neutral-500">Mapato (Revenue)</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Activity size={16} className="text-semantic-info" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">3</p>
              <p className="text-[11px] text-neutral-500">Kampeni Hai (Active Campaigns)</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Flag size={16} className="text-semantic-warning" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">12</p>
              <p className="text-[11px] text-neutral-500">Maudhui ya Kuangaliwa (Moderation Queue)</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Vote size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900">2</p>
              <p className="text-[11px] text-neutral-500">Majaribio A/B (A/B Tests)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity chart placeholder & Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User growth chart placeholder */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">
              Ukuaji wa Watumiaji (User Growth)
            </h2>
            <span className="text-xs text-neutral-500">Miezi 6 iliyopita</span>
          </div>
          <div className="h-48 lg:h-64 bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300">
            <div className="text-center">
              <BarChart3 size={40} className="text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">
                Chati ya ukuaji wa watumiaji (User growth chart)
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Itaonyeshwa hapa baadaye (Coming soon)
              </p>
            </div>
          </div>
        </Card>

        {/* Quick actions */}
        <Card padding="lg">
          <h2 className="text-base font-bold text-neutral-900 mb-4">
            Vitendo vya Haraka (Quick Actions)
          </h2>
          <div className="space-y-2">
            <Link href="/create?type=vote&curated=true" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start" icon={<PlusCircle size={16} />}>
                Unda Kura ya Kudumu (Create Curated Vote)
              </Button>
            </Link>
            <Link href="/admin/categories" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start" icon={<FolderTree size={16} />}>
                Simamia Makundi (Manage Categories)
              </Button>
            </Link>
            <Link href="/admin/reports" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start" icon={<Flag size={16} />}>
                Angalia Ripoti (View Reports)
              </Button>
            </Link>
            <Link href="/admin/monetization" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start" icon={<BarChart3 size={16} />}>
                Mapato (Monetization)
              </Button>
            </Link>
            <Link href="/admin/marketing" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start" icon={<Activity size={16} />}>
                Kampeni (Marketing)
              </Button>
            </Link>
            <Link href="/admin/analytics" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start" icon={<BarChart3 size={16} />}>
                Uchambuzi (Analytics)
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
