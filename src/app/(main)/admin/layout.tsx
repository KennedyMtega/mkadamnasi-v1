'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getAnonymousId } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Vote,
  Star,
  Flag,
  FolderTree,
  Settings,
  Shield,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashibodi (Dashboard)', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Watumiaji (Users)', icon: Users },
  { href: '/admin/votes', label: 'Kura (Votes)', icon: Vote },
  { href: '/admin/ratings', label: 'Tathmini (Ratings)', icon: Star },
  { href: '/admin/reports', label: 'Ripoti (Reports)', icon: Flag },
  { href: '/admin/categories', label: 'Makundi (Categories)', icon: FolderTree },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'x-anonymous-id': getAnonymousId() },
        });
        if (res.ok) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      }
    }
    checkAdmin();
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">Inathibitisha ruhusa... (Verifying access...)</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-semantic-error/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-semantic-error" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            Ruhusa Imekataliwa (Access Denied)
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            Huna ruhusa ya kufikia dashibodi ya msimamizi. Wasiliana na msimamizi mkuu.
            <br />
            (You do not have permission to access the admin dashboard. Contact the main administrator.)
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-neutral-0 rounded-xl font-semibold hover:bg-brand-primary-dark transition-colors"
          >
            Rudi Nyumbani (Go Home)
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-neutral-0 border-b border-neutral-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-brand-primary" />
          <span className="font-bold text-neutral-900">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-neutral-900/40"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar - desktop always visible, mobile as overlay */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 bg-neutral-0 border-r border-neutral-300 flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:z-10',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-neutral-300">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
              <Shield size={18} className="text-neutral-0" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Mkadamnasi</p>
              <p className="text-xs text-neutral-500">Paneli ya Admin</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
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
        <div className="p-3 border-t border-neutral-300">
          <Link
            href="/settings"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
          >
            <Settings size={18} />
            <span>Mipangilio (Settings)</span>
          </Link>
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
          >
            <ChevronRight size={18} className="rotate-180" />
            <span>Rudi Kwenye App</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
