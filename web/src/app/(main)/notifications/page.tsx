'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Vote, Star, Award, TrendingUp, Users, Megaphone, CheckCheck } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { formatDate } from '@/lib/utils';

const NOTIFICATION_ICONS: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  badge_earned: { icon: Award, color: 'text-semantic-warning', bg: 'bg-yellow-50' },
  vote_result: { icon: Vote, color: 'text-brand-primary', bg: 'bg-brand-primary-light' },
  trending: { icon: TrendingUp, color: 'text-semantic-success', bg: 'bg-emerald-50' },
  system: { icon: Bell, color: 'text-semantic-info', bg: 'bg-blue-50' },
  referral: { icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  marketing: { icon: Megaphone, color: 'text-semantic-info', bg: 'bg-blue-50' },
};

const DEFAULT_ICON = { icon: Bell, color: 'text-neutral-500', bg: 'bg-neutral-100' };

const TABS = [
  { id: 'all', label: 'Zote' },
  { id: 'unread', label: 'Hazijasomwa' },
];

function getNotificationRoute(data: Record<string, unknown> | null): string | null {
  if (!data?.action) return null;
  switch (data.action) {
    case 'view_vote':
      return data.voteId ? `/votes/${data.voteId}` : '/';
    case 'view_rating':
      return data.ratingId ? `/ratings/${data.ratingId}` : '/';
    case 'view_badges':
      return '/profile?tab=badges';
    case 'view_referrals':
      return '/profile';
    default:
      return null;
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const unreadOnly = activeTab === 'unread';

  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ unreadOnly });

  function handleNotificationTap(notification: {
    id: string;
    isRead: boolean;
    data: Record<string, unknown> | null;
  }) {
    if (!notification.isRead) {
      markAsRead([notification.id]);
    }
    const route = getNotificationRoute(notification.data);
    if (route) {
      router.push(route);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Taarifa" rightAction={
        unreadCount > 0 ? (
          <button
            onClick={markAllAsRead}
            className="p-2 rounded-xl hover:bg-neutral-100"
            aria-label="Soma zote"
          >
            <CheckCheck size={20} className="text-neutral-700" />
          </button>
        ) : null
      } />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">Taarifa</h1>
          {unreadCount > 0 && (
            <Badge variant="error">{unreadCount} mpya</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-brand-primary hover:underline"
          >
            Soma zote
          </button>
        )}
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-3">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {loading && notifications.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
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
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={32} />}
            title="Hakuna taarifa mpya"
            description={
              unreadOnly
                ? 'Taarifa zote zimesomwa.'
                : 'Taarifa zako zote zitaonekana hapa unapopata beji, matokeo ya kura, na zaidi.'
            }
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const iconConfig = NOTIFICATION_ICONS[notification.type] || DEFAULT_ICON;
              const Icon = iconConfig.icon;

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationTap(notification)}
                  className="w-full text-left"
                >
                  <Card
                    padding="sm"
                    className={`flex items-start gap-3 transition-colors ${
                      !notification.isRead
                        ? 'bg-brand-primary/5 border-brand-primary/20'
                        : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${iconConfig.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={iconConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.isRead ? 'font-bold' : 'font-semibold'} text-neutral-900`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 mt-0.5">{notification.body}</p>
                      <p className="text-xs text-neutral-500 mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                  </Card>
                </button>
              );
            })}

            {hasMore && (
              <Button
                variant="ghost"
                onClick={loadMore}
                className="w-full"
                size="sm"
              >
                Pakia zaidi
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
