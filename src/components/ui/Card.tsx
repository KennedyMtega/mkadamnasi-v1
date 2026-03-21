import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ children, className, elevated, onClick, padding = 'md' }: CardProps) {
  const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-6' };

  return (
    <div
      className={cn(
        'bg-neutral-0 rounded-2xl border border-neutral-300',
        elevated ? 'shadow-md' : 'shadow-sm',
        paddings[padding],
        onClick && 'cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
