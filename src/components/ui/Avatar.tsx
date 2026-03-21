import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  anonymous?: boolean;
  className?: string;
}

export default function Avatar({ src, name, size = 'md', anonymous = false, className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const iconSizes = { sm: 14, md: 18, lg: 24, xl: 32 };

  if (anonymous) {
    return (
      <div className={cn('rounded-full bg-neutral-100 flex items-center justify-center', sizes[size], className)}>
        <User size={iconSizes[size]} className="text-neutral-500" />
      </div>
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={cn('rounded-full bg-brand-primary text-neutral-0 flex items-center justify-center font-semibold', sizes[size], className)}>
      {initials}
    </div>
  );
}
