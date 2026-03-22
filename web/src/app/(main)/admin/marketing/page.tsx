'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { getAnonymousId } from '@/lib/utils';
import {
  Megaphone,
  Bell,
  Send,
  Plus,
  Users,
  BarChart3,
  Clock,
  FlaskConical,
  Target,
  Eye,
  MousePointer,
  Calendar,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  startDate: string;
  endDate: string | null;
}

interface ABTest {
  id: string;
  name: string;
  status: string;
  metric: string;
  variants: { name: string; result: number }[];
}

interface ScheduledNotification {
  id: string;
  title: string;
  scheduledAt: string;
  segment: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Karibu Mkadamnasi', type: 'push', status: 'ACTIVE', sentCount: 15420, openCount: 8930, clickCount: 2150, startDate: '2026-03-01', endDate: '2026-03-31' },
  { id: '2', name: 'Kura za Wiki', type: 'push', status: 'ACTIVE', sentCount: 8200, openCount: 4100, clickCount: 1230, startDate: '2026-03-15', endDate: null },
  { id: '3', name: 'Biashara Mpya', type: 'sms', status: 'COMPLETED', sentCount: 5000, openCount: 3200, clickCount: 890, startDate: '2026-02-01', endDate: '2026-02-28' },
  { id: '4', name: 'Premium Ofa', type: 'in_app_banner', status: 'PAUSED', sentCount: 20000, openCount: 12000, clickCount: 3500, startDate: '2026-03-10', endDate: '2026-04-10' },
  { id: '5', name: 'Mashindano Mapya', type: 'push', status: 'DRAFT', sentCount: 0, openCount: 0, clickCount: 0, startDate: '2026-04-01', endDate: '2026-04-30' },
];

const MOCK_AB_TESTS: ABTest[] = [
  { id: '1', name: 'Rangi ya Kitufe cha Kura', status: 'RUNNING', metric: 'click_rate', variants: [{ name: 'Kijani (Green)', result: 12.4 }, { name: 'Bluu (Blue)', result: 15.2 }] },
  { id: '2', name: 'Ujumbe wa Arifa', status: 'RUNNING', metric: 'engagement', variants: [{ name: 'Swahili tu', result: 68.5 }, { name: 'Swahili + English', result: 72.1 }] },
];

const MOCK_SCHEDULED: ScheduledNotification[] = [
  { id: '1', title: 'Kura Mpya za Wiki', scheduledAt: '2026-03-24T09:00:00', segment: 'Wote' },
  { id: '2', title: 'Ofa ya Premium', scheduledAt: '2026-03-25T12:00:00', segment: 'Watumiaji Hai' },
  { id: '3', title: 'Mashindano Yanakuja', scheduledAt: '2026-03-28T08:00:00', segment: 'Wapiga Kura' },
];

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'default' }> = {
  ACTIVE: { label: 'Hai', variant: 'success' },
  COMPLETED: { label: 'Imekamilika', variant: 'default' },
  PAUSED: { label: 'Imesimamishwa', variant: 'warning' },
  DRAFT: { label: 'Rasimu', variant: 'default' },
  RUNNING: { label: 'Inaendelea', variant: 'success' },
};

const typeLabels: Record<string, string> = {
  push: 'Arifa (Push)',
  sms: 'SMS',
  email: 'Barua Pepe',
  in_app_banner: 'Bango la App',
};

const SEGMENTS = ['Wote (All)', 'Watumiaji Hai (Active)', 'Premium', 'Wapiga Kura (Voters)', 'Watathmini (Raters)', 'Biashara (Business)'];

export default function MarketingPage() {
  const [loading, setLoading] = useState(true);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifSegment, setNotifSegment] = useState('Wote (All)');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSendNotification = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) return;
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSentSuccess(true);
    setNotifTitle('');
    setNotifBody('');
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Masoko (Marketing)
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Kampeni na arifa za jukwaa (Campaigns &amp; notifications)
          </p>
        </div>
        <Button icon={<Plus size={16} />}>
          Kampeni Mpya
        </Button>
      </div>

      {/* Active campaigns summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md">
              <Skeleton className="w-full h-24" variant="rectangular" />
            </Card>
          ))
        ) : (
          activeCampaigns.map((campaign) => (
            <Card key={campaign.id} padding="md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-neutral-900">{campaign.name}</h3>
                  <span className="text-xs text-neutral-500">{typeLabels[campaign.type] || campaign.type}</span>
                </div>
                <Badge variant={statusLabels[campaign.status]?.variant || 'default'}>
                  {statusLabels[campaign.status]?.label || campaign.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-neutral-50">
                  <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                    <Target size={12} />
                  </div>
                  <p className="text-sm font-bold text-neutral-900">{(campaign.sentCount / 1000).toFixed(1)}K</p>
                  <p className="text-[10px] text-neutral-500">Waliofikiwa</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-neutral-50">
                  <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                    <Eye size={12} />
                  </div>
                  <p className="text-sm font-bold text-neutral-900">{Math.round((campaign.openCount / campaign.sentCount) * 100)}%</p>
                  <p className="text-[10px] text-neutral-500">Walifungua</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-neutral-50">
                  <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                    <MousePointer size={12} />
                  </div>
                  <p className="text-sm font-bold text-neutral-900">{Math.round((campaign.clickCount / campaign.sentCount) * 100)}%</p>
                  <p className="text-[10px] text-neutral-500">Walibofya</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Push notification sender & Scheduled */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Send notification */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-brand-primary" />
            <h2 className="text-base font-bold text-neutral-900">
              Tuma Arifa (Send Push Notification)
            </h2>
          </div>
          {loading ? (
            <Skeleton className="w-full h-48" variant="rectangular" />
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Kichwa (Title)</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Mfano: Kura Mpya ya Wiki!"
                  maxLength={100}
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Ujumbe (Body)</label>
                <textarea
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  placeholder="Andika ujumbe wa arifa..."
                  maxLength={300}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-neutral-0 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Kundi Lengwa (Target Segment)</label>
                <select
                  value={notifSegment}
                  onChange={(e) => setNotifSegment(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                >
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full"
                loading={sending}
                disabled={!notifTitle.trim() || !notifBody.trim()}
                onClick={handleSendNotification}
                icon={<Send size={16} />}
              >
                Tuma Arifa (Send)
              </Button>
              {sentSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-semantic-success/20 text-semantic-success text-sm text-center">
                  Arifa imetumwa! (Notification sent successfully!)
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Scheduled notifications */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-neutral-700" />
            <h2 className="text-base font-bold text-neutral-900">
              Arifa Zilizopangwa (Scheduled Notifications)
            </h2>
          </div>
          {loading ? (
            <Skeleton className="w-full h-48" variant="rectangular" />
          ) : (
            <div className="space-y-3">
              {MOCK_SCHEDULED.map((notif) => (
                <div key={notif.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-semantic-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{notif.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-500">
                        {new Date(notif.scheduledAt).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-neutral-400">|</span>
                      <span className="text-xs text-neutral-500">{notif.segment}</span>
                    </div>
                  </div>
                  <Badge variant="warning">Inasubiri</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Campaign list table */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-neutral-700" />
            <h2 className="text-base font-bold text-neutral-900">
              Kampeni Zote (All Campaigns)
            </h2>
          </div>
          <span className="text-xs text-neutral-500">Kampeni {MOCK_CAMPAIGNS.length}</span>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12" variant="rectangular" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium">Jina</th>
                  <th className="text-left py-3 px-4 text-neutral-500 font-medium">Aina</th>
                  <th className="text-center py-3 px-4 text-neutral-500 font-medium">Hali</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Waliotumwa</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Walifungua</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Walibofya</th>
                  <th className="text-right py-3 px-4 text-neutral-500 font-medium">Tarehe</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-medium text-neutral-900">{c.name}</td>
                    <td className="py-3 px-4 text-neutral-700">{typeLabels[c.type] || c.type}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={statusLabels[c.status]?.variant || 'default'}>
                        {statusLabels[c.status]?.label || c.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-900">{c.sentCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-neutral-900">{c.openCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-neutral-900">{c.clickCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-neutral-500">{c.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* A/B Test summary */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={18} className="text-purple-600" />
          <h2 className="text-base font-bold text-neutral-900">
            Majaribio ya A/B (A/B Tests)
          </h2>
        </div>
        {loading ? (
          <Skeleton className="w-full h-32" variant="rectangular" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_AB_TESTS.map((test) => (
              <div key={test.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">{test.name}</h3>
                    <span className="text-xs text-neutral-500">Kipimo: {test.metric}</span>
                  </div>
                  <Badge variant={statusLabels[test.status]?.variant || 'default'}>
                    {statusLabels[test.status]?.label || test.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {test.variants.map((v, i) => {
                    const isWinning = v.result === Math.max(...test.variants.map((x) => x.result));
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`text-xs font-medium w-28 truncate ${isWinning ? 'text-semantic-success' : 'text-neutral-700'}`}>
                          {v.name}
                        </span>
                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isWinning ? 'bg-semantic-success' : 'bg-neutral-400'}`}
                            style={{ width: `${v.result}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${isWinning ? 'text-semantic-success' : 'text-neutral-700'}`}>
                          {v.result}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
