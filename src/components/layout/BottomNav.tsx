'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Mwanzo', icon: Home },
  { href: '/search', label: 'Tafuta', icon: Search },
  { href: '/create', label: 'Unda', icon: Plus, isCenter: true },
  { href: '/activity', label: 'Shughuli', icon: Bell },
  { href: '/profile', label: 'Wasifu', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-0 border-t border-neutral-300 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
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
                'flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1',
                isActive ? 'text-brand-primary' : 'text-neutral-500'
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
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
