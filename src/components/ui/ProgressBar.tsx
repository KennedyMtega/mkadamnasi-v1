import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'var(--color-brand-primary)',
  label,
  showPercentage = false,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const heights = { sm: 'h-1.5', md: 'h-2' };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-neutral-700">{label}</span>}
          {showPercentage && <span className="text-xs font-semibold" style={{ color }}>{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-neutral-300 overflow-hidden', heights[size])}>
        <div
          className="h-full rounded-full animate-fill transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
