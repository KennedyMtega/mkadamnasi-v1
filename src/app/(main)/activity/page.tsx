'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Vote, Star, Award, TrendingUp, Check } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const mockActivities = [
  {
    id: '1', type: 'vote_result', title: 'Matokeo ya kura yamekamilika!',
    description: 'Mgahawa Bora Dar 2026 — Akemi ameshinda!',
    time: 'Dakika 30 zilizopita', read: false,
    icon: Vote, iconColor: 'text-brand-primary', iconBg: 'bg-brand-primary-light',
  },
  {
    id: '2', type: 'badge_earned', title: 'Beji mpya!',
    description: 'Umepata beji ya "Mpiga Kura 100" 🏆',
    time: 'Saa 2 zilizopita', read: false,
    icon: Award, iconColor: 'text-semantic-warning', iconBg: 'bg-yellow-50',
  },
  {
    id: '3', type: 'trending', title: 'Kura yako inatrendi!',
    description: 'Saluni Bora Mwanza ina kura 500+ sasa',
    time: 'Saa 5 zilizopita', read: true,
    icon: TrendingUp, iconColor: 'text-semantic-success', iconBg: 'bg-emerald-50',
  },
  {
    id: '4', type: 'rating_update', title: 'Kadirio jipya limeongezwa',
    description: 'Mtu amekadiria Hyatt Regency (⭐5)',
    time: 'Jana', read: true,
    icon: Star, iconColor: 'text-semantic-warning', iconBg: 'bg-yellow-50',
  },
  {
    id: '5', type: 'system', title: 'Karibu Mkadamnasi!',
    description: 'Anza kupiga kura na kukadiria leo. Kura zako ni za siri.',
    time: 'Siku 3 zilizopita', read: true,
    icon: Bell, iconColor: 'text-semantic-info', iconBg: 'bg-blue-50',
  },
];

export default function ActivityPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread'
    ? mockActivities.filter(a => !a.read)
    : mockActivities;

  const unreadCount = mockActivities.filter(a => !a.read).length;

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
          {unreadCount > 0 && (
            <Badge variant="error">{unreadCount} mpya</Badge>
          )}
        </div>
        <button className="text-sm font-medium text-brand-primary hover:underline">Soma zote</button>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            Zote ({mockActivities.length})
          </Chip>
          <Chip active={filter === 'unread'} onClick={() => setFilter('unread')}>
            Hazijasomwa ({unreadCount})
          </Chip>
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <Bell size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-700 font-medium">Hakuna arifa mpya</p>
            <p className="text-sm text-neutral-500 mt-1">Shughuli zako zote zitaonekana hapa</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  padding="sm"
                  className={`flex items-start gap-3 ${!item.read ? 'border-l-[3px] border-l-brand-primary' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={item.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                      {!item.read && <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-neutral-700 mt-0.5">{item.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">{item.time}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
