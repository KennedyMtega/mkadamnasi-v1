'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VoteResultBarProps {
  title: string;
  voteCount: number;
  percentage: number;
  isWinning?: boolean;
  isSelected?: boolean;
  color?: string;
  animationDelay?: number;
  className?: string;
}

export default function VoteResultBar({
  title,
  voteCount,
  percentage,
  isWinning = false,
  isSelected = false,
  color,
  animationDelay = 0,
  className,
}: VoteResultBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 100 + animationDelay);

    return () => clearTimeout(timer);
  }, [percentage, animationDelay]);

  const barColor = color || (isWinning ? 'var(--color-brand-primary)' : 'var(--color-neutral-300)');

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-sm font-medium truncate flex-1 mr-2',
            isWinning ? 'text-neutral-900' : 'text-neutral-700',
            isSelected && 'font-semibold'
          )}
        >
          {title}
          {isSelected && (
            <span className="ml-1.5 text-brand-primary text-xs">(Chaguo lako)</span>
          )}
        </span>
        <span
          className={cn(
            'text-sm font-bold shrink-0',
            isWinning ? 'text-brand-primary' : 'text-neutral-700'
          )}
        >
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="relative w-full h-8 rounded-xl bg-neutral-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-xl transition-all duration-700 ease-out"
          style={{
            width: `${animatedWidth}%`,
            backgroundColor: barColor,
            opacity: isWinning ? 0.2 : 0.12,
          }}
        />
        <div className="relative h-full flex items-center justify-between px-3">
          <span className="text-xs text-neutral-500 font-medium">
            {voteCount.toLocaleString()} kura
          </span>
        </div>
      </div>
    </div>
  );
}
