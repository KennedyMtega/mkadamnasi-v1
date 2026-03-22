import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export default function Skeleton({ className, variant = 'rectangular', width, height }: SkeletonProps) {
  const variants = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'bg-neutral-300 animate-pulse',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-neutral-0 rounded-2xl border border-neutral-300 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" className="w-16 h-5" />
        <Skeleton variant="rectangular" className="w-12 h-5" />
      </div>
      <Skeleton variant="text" className="w-3/4 h-5" />
      <Skeleton variant="text" className="w-1/2 h-4" />
      <div className="flex items-center gap-3">
        <Skeleton variant="text" className="w-20 h-3" />
        <Skeleton variant="text" className="w-16 h-3" />
      </div>
    </div>
  );
}

export function VoteOptionSkeleton() {
  return (
    <div className="border border-neutral-300 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-5 h-5" />
        <Skeleton variant="text" className="w-40 h-4" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-neutral-0 rounded-2xl border border-neutral-300 p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-20 h-20" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-32 h-5" />
          <Skeleton variant="text" className="w-24 h-4" />
          <Skeleton variant="rectangular" className="w-full h-2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton variant="rectangular" className="h-16" />
        <Skeleton variant="rectangular" className="h-16" />
        <Skeleton variant="rectangular" className="h-16" />
      </div>
    </div>
  );
}
