'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
  showNotificationBell?: boolean;
}

export default function TopBar({ title, showBack = false, rightAction, transparent = false, className, showNotificationBell = false }: TopBarProps) {
  const router = useRouter();
  const { unreadCount } = useNotifications({ limit: 1 });

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex items-center justify-between h-14 px-4',
        transparent ? 'bg-transparent' : 'bg-neutral-0/80 backdrop-blur-md border-b border-neutral-300',
        'lg:hidden',
        className
      )}
    >
      <div className="w-10">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 transition-colors"
            aria-label="Rudi nyuma"
          >
            <ChevronLeft size={24} className="text-neutral-900" />
          </button>
        )}
      </div>
      {title && (
        <h1 className="text-lg font-semibold text-neutral-900 text-center flex-1 truncate">
          {title}
        </h1>
      )}
      <div className="flex items-center gap-1">
        {showNotificationBell && (
          <Link
            href="/notifications"
            className="relative p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            aria-label="Taarifa"
          >
            <Bell size={20} className="text-neutral-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-semantic-error text-neutral-0 text-[10px] font-bold leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        )}
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
