'use client';

import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export default function Chip({ children, active = false, onClick, icon, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
        active
          ? 'bg-brand-primary text-neutral-0 shadow-sm'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-300',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
