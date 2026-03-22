'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { getAnonymousId, formatNumber } from '@/lib/utils';
import {
  Users,
  Activity,
  Vote,
  Star,
  Clock,
  TrendingUp,
  BarChart3,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Flame,
} from 'lucide-react';

interface KPIStats {
  dau: number;
  mau: number;
  totalUsers: number;
  totalVotes: number;
  totalRatings: number;
  avgSession: string;
}

const MOCK_KPI: KPIStats = {
  dau: 3240,
  mau: 28500,
  totalUsers: 45200,
  totalVotes: 128400,
  totalRatings: 67800,
  avgSession: '4:32',
};

const MONTHLY_REGISTRATIONS = [
  { month: 'Okt', count: 3200 },
  { month: 'Nov', count: 4100 },
  { month: 'Dis', count: 5600 },
  { month: 'Jan', count: 6800 },
  { month: 'Feb', count: 7200 },
  { month: 'Mar', count: 8400 },
];

const WEEKLY_CONTENT = [
  { week: 'W1', votes: 420, ratings: 310 },
  { week: 'W2', votes: 480, ratings: 350 },
  { week: 'W3', votes: 510, ratings: 380 },
  { week: 'W4', votes: 550, ratings: 410 },
];

const CATEGORY_PERFORMANCE = [
  { name: 'Siasa (Politics)', votes: 32400, ratings: 12100, engagement: 78 },
  { name: 'Burudani (Entertainment)', votes: 28900, ratings: 18500, engagement: 85 },
  { name: 'Michezo (Sports)', votes: 21300, ratings: 9800, engagement: 72 },
  { name: 'Biashara (Business)', votes: 15200, ratings: 14200, engagement: 68 },
  { name: 'Elimu (Education)', votes: 12800, ratings: 8400, engagement: 65 },
  { name: 'Afya (Health)', votes: 9600, ratings: 5800, engagement: 58 },
];

const REGIONAL_DISTRIBUTION = [
  { region: 'Dar es Salaam', users: 18500, level: 'Juu sana' },
  { region: 'Dodoma', users: 4200, level: 'Juu' },
  { region: 'Arusha', users: 3800, level: 'Juu' },
  { region: 'Mwanza', users: 3100, level: 'Wastani' },
  { region: 'Mbeya', users: 2400, level: 'Wastani' },
  { region: 'Tanga', users: 1900, level: 'Wastani' },
  { region: 'Morogoro', users: 1600, level: 'Chini' },
  { region: 'Zanzibar', users: 1400, level: 'Chini' },
];

const TRENDING_ITEMS = [
  { title: 'Rais Bora wa Tanzania?', type: 'vote', engagement: 12400 },
  { title: 'Hospitali Bora Dar es Salaam', type: 'rating', engagement: 8900 },
  { title: 'Mchezaji Bora Simba vs Yanga', type: 'vote', engagement: 7600 },
  { title: 'Huduma za TANESCO', type: 'rating', engagement: 5200 },
  { title: 'Chuo Kikuu Bora Tanzania', type: 'vote', engagement: 4800 },
];

const DEVICE_BREAKDOWN = [
  { device: 'Simu (Mobile)', icon: Smartphone, percentage: 78, color: 'bg-brand-primary' },
  { device: 'Kompyuta (Desktop)', icon: Monitor, percentage: 16, color: 'bg-purple-500' },
  { device: 'Kibao (Tablet)', icon: Tablet, percentage: 6, color: 'bg-amber-500' },
];

const levelColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  'Juu sana': 'success',
  'Juu': 'success',
  'Wastani': 'warning',
  'Chini': 'default',
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const maxReg = Math.max(...MONTHLY_REGISTRATIONS.map((m) => m.count));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Uchambuzi (Analytics)
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Takwimu za jukwaa la Mkadamnasi (Platform analytics dashboard)
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="w-8 h-8 mb-3" variant="circular" />
              <Skeleton className="w-20 h-6 mb-1" variant="text" />
              <Skeleton className="w-16 h-4" variant="text" />
            </Card>
          ))
        ) : (
          <>
            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <Activity size={20} className="text-semantic-success" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{formatNumber(MOCK_KPI.dau)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">DAU</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <Users size={20} className="text-semantic-info" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{formatNumber(MOCK_KPI.mau)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">MAU</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{formatNumber(MOCK_KPI.totalUsers)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Watumiaji Wote</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <Vote size={20} className="text-semantic-success" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{formatNumber(MOCK_KPI.totalVotes)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Kura Zote</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                <Star size={20} className="text-semantic-warning" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{formatNumber(MOCK_KPI.totalRatings)}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Tathmini Zote</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <Clock size={20} className="text-semantic-info" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{MOCK_KPI.avgSession}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Wastani wa Kikao</p>
            </Card>
          </>
        )}
      </div>

      {/* User growth & Content activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User growth */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">
              Ukuaji wa Watumiaji (User Growth)
            </h2>
            <span className="text-xs text-neutral-500">Usajili kwa mwezi</span>
          </div>
          {loading ? (
            <Skeleton className="w-full h-40" variant="rectangular" />
          ) : (
            <div className="flex items-end gap-3 h-40">
              {MONTHLY_REGISTRATIONS.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-neutral-500 font-medium">{formatNumber(m.count)}</span>
                  <div
                    className="w-full bg-brand-primary rounded-t-lg transition-all"
                    style={{ height: `${(m.count / maxReg) * 110}px` }}
                  />
                  <span className="text-xs text-neutral-700 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Content activity */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">
              Shughuli za Maudhui (Content Activity)
            </h2>
            <span className="text-xs text-neutral-500">Kwa wiki</span>
          </div>
          {loading ? (
            <Skeleton className="w-full h-40" variant="rectangular" />
          ) : (
            <div className="space-y-4">
              {WEEKLY_CONTENT.map((w) => (
                <div key={w.week} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-700">{w.week}</span>
                    <span className="text-xs text-neutral-500">Kura: {w.votes} | Tathmini: {w.ratings}</span>
                  </div>
                  <div className="flex gap-1 h-3">
                    <div
                      className="bg-semantic-success rounded-l-full"
                      style={{ width: `${(w.votes / (w.votes + w.ratings)) * 100}%` }}
                    />
                    <div
                      className="bg-semantic-warning rounded-r-full"
                      style={{ width: `${(w.ratings / (w.votes + w.ratings)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-semantic-success" />
                  <span className="text-xs text-neutral-500">Kura (Votes)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-semantic-warning" />
                  <span className="text-xs text-neutral-500">Tathmini (Ratings)</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Category performance */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-neutral-700" />
          <h2 className="text-base font-bold text-neutral-900">
            Utendaji wa Makundi (Category Performance)
          </h2>
        </div>
        {loading ? (
          <Skeleton className="w-full h-48" variant="rectangular" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium">Kategoria</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Kura</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Tathmini</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Ushiriki</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_PERFORMANCE.map((cat) => (
                  <tr key={cat.name} className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium text-neutral-900">{cat.name}</td>
                    <td className="py-3 px-4 text-right text-neutral-900">{formatNumber(cat.votes)}</td>
                    <td className="py-3 px-4 text-right text-neutral-900">{formatNumber(cat.ratings)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-primary"
                            style={{ width: `${cat.engagement}%` }}
                          />
                        </div>
                        <span className="text-neutral-900 font-medium">{cat.engagement}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Regional distribution & Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Regional distribution */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-neutral-700" />
            <h2 className="text-base font-bold text-neutral-900">
              Usambazaji wa Mikoa (Regional Distribution)
            </h2>
          </div>
          {loading ? (
            <Skeleton className="w-full h-48" variant="rectangular" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-3 text-neutral-500 font-medium">Mkoa</th>
                    <th className="text-right py-2 px-3 text-neutral-500 font-medium">Watumiaji</th>
                    <th className="text-center py-2 px-3 text-neutral-500 font-medium">Kiwango</th>
                  </tr>
                </thead>
                <tbody>
                  {REGIONAL_DISTRIBUTION.map((r) => (
                    <tr key={r.region} className="border-b border-neutral-100">
                      <td className="py-2 px-3 font-medium text-neutral-900">{r.region}</td>
                      <td className="py-2 px-3 text-right text-neutral-900">{formatNumber(r.users)}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={levelColors[r.level] || 'default'}>{r.level}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Trending items */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-semantic-error" />
            <h2 className="text-base font-bold text-neutral-900">
              Vinavyoongoza (Top Trending)
            </h2>
          </div>
          {loading ? (
            <Skeleton className="w-full h-48" variant="rectangular" />
          ) : (
            <div className="space-y-3">
              {TRENDING_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary-light flex items-center justify-center shrink-0 text-sm font-bold text-brand-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={item.type === 'vote' ? 'success' : 'warning'}>
                        {item.type === 'vote' ? 'Kura' : 'Tathmini'}
                      </Badge>
                      <span className="text-xs text-neutral-500">{formatNumber(item.engagement)} ushiriki</span>
                    </div>
                  </div>
                  <TrendingUp size={16} className="text-semantic-success shrink-0" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Device breakdown */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone size={18} className="text-neutral-700" />
          <h2 className="text-base font-bold text-neutral-900">
            Mgawanyo wa Vifaa (Device Breakdown)
          </h2>
        </div>
        {loading ? (
          <Skeleton className="w-full h-20" variant="rectangular" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEVICE_BREAKDOWN.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.device} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-neutral-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{d.device}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.percentage}%` }} />
                      </div>
                      <span className="text-sm font-bold text-neutral-900">{d.percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
