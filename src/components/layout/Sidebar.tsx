'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, PlusCircle, Bell, User, TrendingUp, Settings, Shield, BarChart3, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNav = [
  { href: '/', label: 'Mwanzo', labelEn: 'Home', icon: Home },
  { href: '/search', label: 'Tafuta', labelEn: 'Search', icon: Search },
  { href: '/create', label: 'Unda Mpya', labelEn: 'Create', icon: PlusCircle },
  { href: '/activity', label: 'Shughuli', labelEn: 'Activity', icon: Bell },
  { href: '/profile', label: 'Wasifu', labelEn: 'Profile', icon: User },
];

const secondaryNav = [
  { href: '/trending', label: 'Vinavyotrendi', labelEn: 'Trending', icon: TrendingUp },
  { href: '/leaderboard', label: 'Ubao wa Viongozi', labelEn: 'Leaderboard', icon: BarChart3 },
  { href: '/premium', label: 'Premium', labelEn: 'Premium', icon: Crown },
];

const bottomNav = [
  { href: '/settings', label: 'Mipangilio', labelEn: 'Settings', icon: Settings },
  { href: '/admin', label: 'Admin', labelEn: 'Admin', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-neutral-0 border-r border-neutral-300 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-neutral-300">
        <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <div>
          <h1 className="font-bold text-neutral-900 text-base leading-tight">Mkadamnasi</h1>
          <p className="text-[10px] text-neutral-500">Sauti Yako, Siri Yako</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Menu Kuu</p>
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          <p className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Gundua</p>
        </div>
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-3 border-t border-neutral-300 space-y-1">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-primary-light text-brand-primary'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
