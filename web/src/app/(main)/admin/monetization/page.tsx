'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import ErrorState from '@/components/ui/ErrorState';
import { getAnonymousId, formatNumber } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  Zap,
  Crown,
  ShieldCheck,
  Trophy,
  CreditCard,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

interface RevenueStats {
  totalRevenue: number;
  thisMonth: number;
  boostRevenue: number;
  premiumRevenue: number;
  recentTransactions: Transaction[];
  monthlyTrend: MonthlyData[];
  revenueByType: RevenueType[];
}

interface Transaction {
  id: string;
  user: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
}

interface RevenueType {
  type: string;
  amount: number;
  percentage: number;
}

interface PricingItem {
  name: string;
  nameEn: string;
  currentPrice: number;
  icon: React.ReactNode;
}

const formatTZS = (amount: number) =>
  new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

// Mock data — replace with API calls when backend is ready
const mockStats: RevenueStats = {
  totalRevenue: 12450000,
  thisMonth: 2400000,
  boostRevenue: 5200000,
  premiumRevenue: 4800000,
  recentTransactions: [
    { id: '1', user: 'Juma M.', type: 'Boost Vote', amount: 5000, status: 'COMPLETED', date: '2026-03-22' },
    { id: '2', user: 'Amina K.', type: 'Premium', amount: 15000, status: 'COMPLETED', date: '2026-03-21' },
    { id: '3', user: 'Hassan R.', type: 'Business Verify', amount: 50000, status: 'COMPLETED', date: '2026-03-21' },
    { id: '4', user: 'Fatma S.', type: 'Boost Vote', amount: 10000, status: 'COMPLETED', date: '2026-03-20' },
    { id: '5', user: 'Ali B.', type: 'Contest Host', amount: 100000, status: 'PENDING', date: '2026-03-20' },
    { id: '6', user: 'Mwajuma T.', type: 'Premium', amount: 15000, status: 'COMPLETED', date: '2026-03-19' },
    { id: '7', user: 'Rashid H.', type: 'Boost Vote', amount: 25000, status: 'COMPLETED', date: '2026-03-19' },
    { id: '8', user: 'Grace N.', type: 'Business Verify', amount: 50000, status: 'FAILED', date: '2026-03-18' },
    { id: '9', user: 'Peter L.', type: 'Premium', amount: 15000, status: 'COMPLETED', date: '2026-03-17' },
    { id: '10', user: 'Salma D.', type: 'Boost Vote', amount: 5000, status: 'COMPLETED', date: '2026-03-17' },
  ],
  monthlyTrend: [
    { month: 'Okt', revenue: 1200000 },
    { month: 'Nov', revenue: 1800000 },
    { month: 'Des', revenue: 1500000 },
    { month: 'Jan', revenue: 2100000 },
    { month: 'Feb', revenue: 2300000 },
    { month: 'Mar', revenue: 2400000 },
  ],
  revenueByType: [
    { type: 'Boost Votes', amount: 5200000, percentage: 42 },
    { type: 'Premium', amount: 4800000, percentage: 38 },
    { type: 'Business Verify', amount: 1500000, percentage: 12 },
    { type: 'Contest Hosting', amount: 950000, percentage: 8 },
  ],
};

const pricingItems: PricingItem[] = [
  { name: 'Kura ya Boost', nameEn: 'Boost Vote', currentPrice: 500, icon: <Zap size={16} className="text-amber-500" /> },
  { name: 'Premium (Mwezi)', nameEn: 'Premium Monthly', currentPrice: 15000, icon: <Crown size={16} className="text-purple-600" /> },
  { name: 'Uthibitisho Biashara', nameEn: 'Business Verification', currentPrice: 50000, icon: <ShieldCheck size={16} className="text-semantic-info" /> },
  { name: 'Uandaaji Mashindano', nameEn: 'Contest Hosting', currentPrice: 100000, icon: <Trophy size={16} className="text-amber-600" /> },
];

export default function MonetizationPage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(false);
    try {
      // TODO: Replace with actual API call
      // const res = await fetch('/api/admin/monetization', {
      //   headers: { 'x-anonymous-id': getAnonymousId() },
      // });
      // if (!res.ok) throw new Error('Failed');
      // const data = await res.json();
      await new Promise((r) => setTimeout(r, 500));
      setStats(mockStats);
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

  const maxRevenue = stats ? Math.max(...stats.monthlyTrend.map((m) => m.revenue)) : 1;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Mapato (Monetization)
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Muhtasari wa mapato na udhibiti wa bei (Revenue overview & pricing controls)
        </p>
      </div>

      {/* Revenue summary cards */}
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
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <DollarSign size={20} className="text-semantic-success" />
              </div>
              <p className="text-xl font-bold text-neutral-900">
                {formatTZS(stats.totalRevenue)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Mapato Yote (Total Revenue)
              </p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-semantic-info" />
              </div>
              <p className="text-xl font-bold text-neutral-900">
                {formatTZS(stats.thisMonth)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Mwezi Huu (This Month)
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={12} className="text-semantic-success" />
                <span className="text-xs text-semantic-success font-medium">+4.3%</span>
              </div>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                <Zap size={20} className="text-amber-500" />
              </div>
              <p className="text-xl font-bold text-neutral-900">
                {formatTZS(stats.boostRevenue)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Mapato ya Boost (Boost Revenue)
              </p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <Crown size={20} className="text-purple-600" />
              </div>
              <p className="text-xl font-bold text-neutral-900">
                {formatTZS(stats.premiumRevenue)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Premium (Subscriptions)
              </p>
            </Card>
          </>
        ) : null}
      </div>

      {/* Revenue trend & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend chart */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">
              Mwenendo wa Mapato (Revenue Trend)
            </h2>
            <span className="text-xs text-neutral-500">Miezi 6 iliyopita</span>
          </div>
          {loading ? (
            <Skeleton className="w-full h-48" variant="rectangular" />
          ) : stats ? (
            <div className="flex items-end gap-3 h-48">
              {stats.monthlyTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {formatTZS(m.revenue)}
                  </span>
                  <div
                    className="w-full bg-brand-primary rounded-t-lg transition-all"
                    style={{ height: `${(m.revenue / maxRevenue) * 140}px` }}
                  />
                  <span className="text-xs text-neutral-700 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        {/* Revenue by type */}
        <Card padding="lg">
          <h2 className="text-base font-bold text-neutral-900 mb-4">
            Mgawanyo wa Mapato (Revenue Breakdown)
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8" variant="rectangular" />
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-4">
              {stats.revenueByType.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-700">{item.type}</span>
                    <span className="text-sm font-bold text-neutral-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{formatTZS(item.amount)}</p>
                </div>
              ))}
            </div>
          ) : null}
        </Card>
      </div>

      {/* Pricing controls */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Udhibiti wa Bei (Pricing Controls)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-2 text-neutral-500 font-medium">Bidhaa (Product)</th>
                <th className="text-left py-3 px-2 text-neutral-500 font-medium">Maelezo (Description)</th>
                <th className="text-right py-3 px-2 text-neutral-500 font-medium">Bei ya Sasa (Current Price)</th>
              </tr>
            </thead>
            <tbody>
              {pricingItems.map((item) => (
                <tr key={item.nameEn} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium text-neutral-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-neutral-500">{item.nameEn}</td>
                  <td className="py-3 px-2 text-right font-bold text-neutral-900">
                    {formatTZS(item.currentPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent transactions */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-900">
            Malipo ya Hivi Karibuni (Recent Transactions)
          </h2>
          <CreditCard size={18} className="text-neutral-400" />
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12" variant="rectangular" />
            ))}
          </div>
        ) : stats ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-2 text-neutral-500 font-medium">Mtumiaji</th>
                  <th className="text-left py-2 px-2 text-neutral-500 font-medium">Aina</th>
                  <th className="text-right py-2 px-2 text-neutral-500 font-medium">Kiasi</th>
                  <th className="text-center py-2 px-2 text-neutral-500 font-medium">Hali</th>
                  <th className="text-right py-2 px-2 text-neutral-500 font-medium">Tarehe</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2.5 px-2 font-medium text-neutral-900">{tx.user}</td>
                    <td className="py-2.5 px-2 text-neutral-700">{tx.type}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-neutral-900">
                      {formatTZS(tx.amount)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <Badge
                        variant={
                          tx.status === 'COMPLETED' ? 'success' :
                          tx.status === 'PENDING' ? 'warning' : 'error'
                        }
                      >
                        {tx.status === 'COMPLETED' ? 'Imekamilika' :
                         tx.status === 'PENDING' ? 'Inasubiri' : 'Imeshindikana'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
