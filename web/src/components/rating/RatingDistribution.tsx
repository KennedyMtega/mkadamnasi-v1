'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDistributionProps {
  distribution: Record<string, number>;
  totalRatings: number;
  className?: string;
}

const STAR_COLORS = [
  'var(--color-rating-1, #EF4444)',
  'var(--color-rating-2, #F97316)',
  'var(--color-rating-3, #F59E0B)',
  'var(--color-rating-4, #34D399)',
  'var(--color-rating-5, #10B981)',
];

export default function RatingDistribution({
  distribution,
  totalRatings,
  className,
}: RatingDistributionProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stars = [5, 4, 3, 2, 1];

  return (
    <div className={cn('space-y-2', className)}>
      {stars.map((star) => {
        const count = distribution[String(star)] ?? 0;
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 w-10 shrink-0 justify-end">
              <span className="text-xs font-medium text-neutral-700">{star}</span>
              <Star
                size={12}
                fill={STAR_COLORS[star - 1]}
                stroke={STAR_COLORS[star - 1]}
                strokeWidth={1.5}
              />
            </div>

            <div className="flex-1 h-2.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: animated ? `${percentage}%` : '0%',
                  backgroundColor: STAR_COLORS[star - 1],
                }}
              />
            </div>

            <span className="text-xs text-neutral-500 w-10 text-right shrink-0">
              {count.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
