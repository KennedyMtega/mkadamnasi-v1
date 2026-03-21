'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export default function TopBar({ title, showBack = false, rightAction, transparent = false, className }: TopBarProps) {
  const router = useRouter();

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
      <div className="w-10 flex justify-end">
        {rightAction}
      </div>
    </header>
  );
}
