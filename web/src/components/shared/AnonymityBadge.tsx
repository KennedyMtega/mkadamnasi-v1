import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnonymityBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export default function AnonymityBadge({ size = 'sm', className }: AnonymityBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
  };

  const iconSizes = { sm: 10, md: 14 };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-md bg-semantic-success/10 text-semantic-success',
      sizes[size],
      className
    )}>
      <Shield size={iconSizes[size]} />
      Siri
    </span>
  );
}
