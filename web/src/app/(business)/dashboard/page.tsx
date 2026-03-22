'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import {
  Star,
  Vote,
  TrendingUp,
  BarChart3,
  PlusCircle,
  Eye,
  ArrowRight,
  Activity,
  Users,
  Clock,
} from 'lucide-react';

interface DashboardStats {
  totalRatings: number;
  averageRating: number;
  totalPolls: number;
  activePolls: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
  }>;
}

export default function BusinessDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/business/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Use placeholder data
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const displayStats = stats || {
    totalRatings: 0,
    averageRating: 0,
    totalPolls: 0,
    activePolls: 0,
    recentActivity: [],
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Karibu! (Welcome!)
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Hii ni dashibodi yako ya biashara. Fuatilia utendaji wako hapa.
          <br />
          This is your business dashboard. Track your performance here.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="animate-pulse space-y-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl" />
                <div className="w-16 h-6 bg-neutral-100 rounded" />
                <div className="w-24 h-4 bg-neutral-100 rounded" />
              </div>
            </Card>
          ))
        ) : (
          <>
            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                <Star size={20} className="text-semantic-warning" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{displayStats.totalRatings}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Tathmini Zote (Total Ratings)</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-semantic-success" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {displayStats.averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Wastani wa Tathmini (Avg Rating)</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={s <= Math.round(displayStats.averageRating) ? 'text-semantic-warning fill-semantic-warning' : 'text-neutral-300'}
                  />
                ))}
              </div>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <Vote size={20} className="text-semantic-info" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{displayStats.totalPolls}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Kura Zote (Total Polls)</p>
            </Card>

            <Card padding="md">
              <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center mb-3">
                <Activity size={20} className="text-brand-primary" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{displayStats.activePolls}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Kura Hai (Active Polls)</p>
            </Card>
          </>
        )}
      </div>

      {/* Quick actions & Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <Card padding="lg">
          <h2 className="text-base font-bold text-neutral-900 mb-4">
            Vitendo vya Haraka (Quick Actions)
          </h2>
          <div className="space-y-2">
            <Link href="/business/polls/create" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light transition-all">
                <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center shrink-0">
                  <PlusCircle size={18} className="text-neutral-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">Unda Kura (Create Poll)</p>
                  <p className="text-xs text-neutral-500">Unda kura mpya ya wateja</p>
                </div>
                <ArrowRight size={16} className="text-neutral-500" />
              </div>
            </Link>

            <Link href="/business/ratings" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light transition-all">
                <div className="w-9 h-9 rounded-lg bg-semantic-warning flex items-center justify-center shrink-0">
                  <Eye size={18} className="text-neutral-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">Angalia Tathmini (View Ratings)</p>
                  <p className="text-xs text-neutral-500">Tazama maoni ya wateja</p>
                </div>
                <ArrowRight size={16} className="text-neutral-500" />
              </div>
            </Link>

            <Link href="/business/analytics" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light transition-all">
                <div className="w-9 h-9 rounded-lg bg-semantic-info flex items-center justify-center shrink-0">
                  <BarChart3 size={18} className="text-neutral-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">Uchambuzi (Analytics)</p>
                  <p className="text-xs text-neutral-500">Fuatilia data yako</p>
                </div>
                <ArrowRight size={16} className="text-neutral-500" />
              </div>
            </Link>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">
              Shughuli za Hivi Karibuni (Recent Activity)
            </h2>
            <span className="text-xs text-neutral-500">Siku 7 zilizopita</span>
          </div>

          {displayStats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {displayStats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    {item.type === 'rating' ? (
                      <Star size={14} className="text-brand-primary" />
                    ) : item.type === 'poll' ? (
                      <Vote size={14} className="text-brand-primary" />
                    ) : (
                      <Users size={14} className="text-brand-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                    <p className="text-xs text-neutral-500">{item.description}</p>
                  </div>
                  <span className="text-xs text-neutral-500 shrink-0 flex items-center gap-1">
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center rounded-xl bg-neutral-100 border border-dashed border-neutral-300">
              <div className="text-center">
                <Activity size={32} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">
                  Hakuna shughuli za hivi karibuni
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  No recent activity. Start by creating a poll or claiming your business.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
