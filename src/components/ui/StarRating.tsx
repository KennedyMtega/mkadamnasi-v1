'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating?: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showLabel?: boolean;
}

const STAR_COLORS = ['var(--color-rating-1)', 'var(--color-rating-2)', 'var(--color-rating-3)', 'var(--color-rating-4)', 'var(--color-rating-5)'];
const STAR_LABELS = ['Mbaya sana', 'Mbaya', 'Wastani', 'Nzuri', 'Bora sana'];

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [animatingStar, setAnimatingStar] = useState(0);

  const sizes = { sm: 14, md: 20, lg: 32, xl: 40 };
  const starSize = sizes[size];
  const displayRating = hoverRating || rating;

  const handleClick = (star: number) => {
    if (!interactive) return;
    setAnimatingStar(star);
    onChange?.(star);
    setTimeout(() => setAnimatingStar(0), 300);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }, (_, i) => {
          const starNum = i + 1;
          const filled = starNum <= Math.floor(displayRating);
          const halfFilled = !filled && starNum <= displayRating + 0.5;
          const color = filled || halfFilled
            ? STAR_COLORS[Math.min(Math.floor(displayRating) - 1, 4)]
            : 'var(--color-neutral-300)';

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              className={cn(
                'transition-transform duration-100',
                interactive && 'cursor-pointer hover:scale-110',
                animatingStar === starNum && 'star-animate',
                !interactive && 'cursor-default'
              )}
              style={{ touchAction: 'manipulation' }}
              onClick={() => handleClick(starNum)}
              onMouseEnter={() => interactive && setHoverRating(starNum)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              aria-label={`${starNum} nyota`}
            >
              <Star
                size={starSize}
                fill={filled || halfFilled ? color : 'none'}
                stroke={color}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      {showLabel && displayRating > 0 && (
        <span
          className="text-xs font-medium"
          style={{ color: STAR_COLORS[Math.min(Math.floor(displayRating) - 1, 4)] }}
        >
          {STAR_LABELS[Math.floor(displayRating) - 1]}
        </span>
      )}
    </div>
  );
}
