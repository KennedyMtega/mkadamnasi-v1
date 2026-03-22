'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Plus, Bell, User, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

const navItems = [
  { href: '/', label: 'Mwanzo', icon: Home },
  { href: '/search', label: 'Tafuta', icon: Search },
  { href: '/create', label: 'Unda', icon: Plus, isCenter: true },
  { href: '/notifications', label: 'Taarifa', icon: Bell, showBadge: true },
  { href: '/profile', label: 'Wasifu', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isAnonymous } = useAuth();
  const { unreadCount } = useNotifications({ limit: 1 });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-0 border-t border-neutral-300 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          // Replace profile tab with upgrade CTA for anonymous users
          if (item.href === '/profile' && isAnonymous) {
            const isActive = pathname === '/upgrade' || pathname === '/profile';
            return (
              <Link
                key="upgrade"
                href="/upgrade"
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1',
                  isActive ? 'text-brand-primary' : 'text-brand-primary/70'
                )}
              >
                <UserPlus size={24} strokeWidth={isActive ? 2 : 1.5} />
                <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>
                  Jiunge
                </span>
              </Link>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shadow-[0_4px_12px_rgba(255,107,53,0.4)] active:scale-95 transition-transform">
                  <Plus size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-brand-primary mt-0.5">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1',
                isActive ? 'text-brand-primary' : 'text-neutral-500'
              )}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                {item.showBadge && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-semantic-error text-neutral-0 text-[9px] font-bold leading-none">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
