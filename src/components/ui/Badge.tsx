import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    success: 'bg-emerald-50 text-semantic-success',
    warning: 'bg-amber-50 text-semantic-warning',
    error: 'bg-red-50 text-semantic-error',
    info: 'bg-blue-50 text-semantic-info',
    orange: 'bg-brand-primary-light text-brand-primary',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center font-medium rounded-md', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
