import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Hitilafu imetokea',
  message = 'Kuna tatizo la muda. Tafadhali jaribu tena.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-semantic-error/10 flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-semantic-error" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-xs">{message}</p>
      {onRetry && (
        <Button className="mt-4" size="sm" onClick={onRetry}>
          Jaribu Tena
        </Button>
      )}
    </div>
  );
}
