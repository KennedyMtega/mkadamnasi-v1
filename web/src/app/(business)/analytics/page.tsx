'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Eye,
  Vote,
  Star,
  ArrowUpRight,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalEngagements: number;
    engagementTrend: number;
    totalViews: number;
    viewTrend: number;
    uniqueVoters: number;
    voterTrend: number;
  };
  weeklyVotes: Array<{ day: string; count: number }>;
  ratingsTrend: Array<{ month: string; average: number }>;
  regionBreakdown: Array<{ region: string; count: number; percentage: number }>;
}

function SimpleBarChart({ data, label }: { data: Array<{ label: string; value: number }>; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <p className="text-sm font-medium text-neutral-700 mb-3">{label}</p>
      <div className="flex items-end gap-2 h-40">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-neutral-500 font-medium">{item.value}</span>
            <div
              className="w-full bg-brand-primary rounded-t-md transition-all duration-700 min-h-[4px]"
              style={{ height: `${(item.value / max) * 100}%` }}
            />
            <span className="text-[10px] text-neutral-500 truncate w-full text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusinessAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/business/analytics?period=${period}`);
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
    fetchAnalytics();
  }, [period]);

  const analytics = data || {
    overview: {
      totalEngagements: 0,
      engagementTrend: 0,
      totalViews: 0,
      viewTrend: 0,
      uniqueVoters: 0,
      voterTrend: 0,
    },
    weeklyVotes: [],
    ratingsTrend: [],
    regionBreakdown: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Uchambuzi (Analytics)</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Fuatilia utendaji wa biashara yako. Track your business performance.
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-brand-primary text-neutral-0'
                  : 'bg-neutral-0 text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              {p === 'week' ? 'Wiki (Week)' : p === 'month' ? 'Mwezi (Month)' : 'Mwaka (Year)'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="animate-pulse space-y-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl" />
                <div className="w-20 h-6 bg-neutral-100 rounded" />
                <div className="w-28 h-4 bg-neutral-100 rounded" />
              </div>
            </Card>
          ))
        ) : (
          <>
            <Card padding="md">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
                  <Users size={20} className="text-brand-primary" />
                </div>
                {analytics.overview.engagementTrend !== 0 && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    analytics.overview.engagementTrend > 0 ? 'text-semantic-success' : 'text-semantic-error'
                  }`}>
                    <ArrowUpRight size={12} className={analytics.overview.engagementTrend < 0 ? 'rotate-90' : ''} />
                    {Math.abs(analytics.overview.engagementTrend)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-neutral-900 mt-3">
                {analytics.overview.totalEngagements.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Ushirikiano Wote (Total Engagements)</p>
            </Card>

            <Card padding="md">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Eye size={20} className="text-semantic-info" />
                </div>
                {analytics.overview.viewTrend !== 0 && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    analytics.overview.viewTrend > 0 ? 'text-semantic-success' : 'text-semantic-error'
                  }`}>
                    <ArrowUpRight size={12} className={analytics.overview.viewTrend < 0 ? 'rotate-90' : ''} />
                    {Math.abs(analytics.overview.viewTrend)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-neutral-900 mt-3">
                {analytics.overview.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Matazamo Yote (Total Views)</p>
            </Card>

            <Card padding="md">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Vote size={20} className="text-semantic-success" />
                </div>
                {analytics.overview.voterTrend !== 0 && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    analytics.overview.voterTrend > 0 ? 'text-semantic-success' : 'text-semantic-error'
                  }`}>
                    <ArrowUpRight size={12} className={analytics.overview.voterTrend < 0 ? 'rotate-90' : ''} />
                    {Math.abs(analytics.overview.voterTrend)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-neutral-900 mt-3">
                {analytics.overview.uniqueVoters.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Wapiga Kura Pekee (Unique Voters)</p>
            </Card>
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Votes chart */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">Kura kwa Wakati (Votes Over Time)</h2>
            <Calendar size={16} className="text-neutral-500" />
          </div>
          {loading ? (
            <div className="h-48 bg-neutral-100 rounded-xl animate-pulse" />
          ) : analytics.weeklyVotes.length > 0 ? (
            <SimpleBarChart
              data={analytics.weeklyVotes.map((w) => ({ label: w.day, value: w.count }))}
              label=""
            />
          ) : (
            <div className="h-48 bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300">
              <div className="text-center">
                <BarChart3 size={32} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Data itaonyeshwa baadaye</p>
                <p className="text-xs text-neutral-400">Chart data will appear here</p>
              </div>
            </div>
          )}
        </Card>

        {/* Ratings trend */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">Mwenendo wa Tathmini (Ratings Trend)</h2>
            <TrendingUp size={16} className="text-neutral-500" />
          </div>
          {loading ? (
            <div className="h-48 bg-neutral-100 rounded-xl animate-pulse" />
          ) : analytics.ratingsTrend.length > 0 ? (
            <SimpleBarChart
              data={analytics.ratingsTrend.map((r) => ({ label: r.month, value: Math.round(r.average * 20) }))}
              label=""
            />
          ) : (
            <div className="h-48 bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300">
              <div className="text-center">
                <Star size={32} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Data itaonyeshwa baadaye</p>
                <p className="text-xs text-neutral-400">Trend data will appear here</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Regional breakdown */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-900">Mgawanyo wa Mikoa (Regional Breakdown)</h2>
          <MapPin size={16} className="text-neutral-500" />
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-neutral-100 rounded animate-pulse" />
            ))}
          </div>
        ) : analytics.regionBreakdown.length > 0 ? (
          <div className="space-y-3">
            {analytics.regionBreakdown.map((region) => (
              <div key={region.region} className="flex items-center gap-3">
                <span className="text-sm text-neutral-700 w-32 shrink-0">{region.region}</span>
                <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-700"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 w-16 text-right">
                  {region.count} ({region.percentage}%)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin size={32} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">Hakuna data ya mkoa bado (No regional data yet)</p>
          </div>
        )}
      </Card>

      {/* Demographics placeholder */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Uchanganuzi wa Idadi (Demographic Insights)
        </h2>
        <div className="h-48 bg-neutral-100 rounded-xl flex items-center justify-center border border-dashed border-neutral-300">
          <div className="text-center">
            <Users size={32} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">Inakuja hivi karibuni (Coming soon)</p>
            <p className="text-xs text-neutral-400">Demographic analytics will be available soon</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
