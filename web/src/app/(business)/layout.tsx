'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Vote,
  Star,
  BarChart3,
  Building2,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Bell,
  LogOut,
  User,
} from 'lucide-react';

interface BusinessContext {
  businessName: string;
  isAuthenticated: boolean;
}

const BusinessCtx = createContext<BusinessContext>({ businessName: '', isAuthenticated: false });
export const useBusinessContext = () => useContext(BusinessCtx);

const navItems = [
  { href: '/business/dashboard', label: 'Dashibodi (Dashboard)', icon: LayoutDashboard },
  { href: '/business/polls', label: 'Kura Zangu (My Polls)', icon: Vote },
  { href: '/business/ratings', label: 'Tathmini (Ratings)', icon: Star },
  { href: '/business/analytics', label: 'Uchambuzi (Analytics)', icon: BarChart3 },
  { href: '/business/claim', label: 'Dai Biashara (Claim Business)', icon: Building2 },
  { href: '/business/settings', label: 'Mipangilio (Settings)', icon: Settings },
  { href: '/business/help', label: 'Msaada (Help)', icon: HelpCircle },
];

const authPaths = ['/business/login', '/business/register'];

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [businessName] = useState('Business Portal');
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  const isActive = (href: string) => {
    if (href === '/business/dashboard') return pathname === '/business/dashboard';
    return pathname.startsWith(href);
  };

  // Auth pages get a clean layout
  if (isAuthPage) {
    return (
      <BusinessCtx.Provider value={{ businessName, isAuthenticated: false }}>
        <div className="min-h-screen bg-neutral-100">
          {children}
        </div>
      </BusinessCtx.Provider>
    );
  }

  return (
    <BusinessCtx.Provider value={{ businessName, isAuthenticated: true }}>
      <div className="min-h-screen bg-neutral-100">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40 bg-neutral-0 border-b border-neutral-300 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-brand-primary" />
            <span className="font-bold text-neutral-900 text-sm">Business Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors relative">
              <Bell size={20} className="text-neutral-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-semantic-error rounded-full" />
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        {mobileNavOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-neutral-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-0 left-0 z-40 h-full w-64 bg-neutral-0 border-r border-neutral-300 flex flex-col transition-transform duration-300',
            'lg:translate-x-0 lg:z-10',
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-neutral-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
                <Building2 size={20} className="text-neutral-0" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">{businessName}</p>
                <p className="text-xs text-neutral-500">Business Portal</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-brand-primary-light text-brand-primary'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-300 space-y-1">
            <Link
              href="/business/login"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
            >
              <LogOut size={18} />
              <span>Toka (Logout)</span>
            </Link>
            <Link
              href="/"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
            >
              <ChevronRight size={18} className="rotate-180" />
              <span>Rudi Nyumbani (Home)</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:ml-64 min-h-screen">
          {/* Desktop top bar */}
          <div className="hidden lg:flex sticky top-0 z-20 bg-neutral-0 border-b border-neutral-300 px-6 py-3 items-center justify-end gap-4">
            <button className="p-2 rounded-xl hover:bg-neutral-100 transition-colors relative">
              <Bell size={20} className="text-neutral-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-semantic-error rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-brand-primary-light flex items-center justify-center">
                <User size={16} className="text-brand-primary" />
              </div>
              <span className="text-sm font-medium text-neutral-700">Profile</span>
            </div>
          </div>

          <main className="max-w-7xl mx-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </BusinessCtx.Provider>
  );
}
