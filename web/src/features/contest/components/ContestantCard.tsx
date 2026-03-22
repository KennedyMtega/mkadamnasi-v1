'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ContestantCardProps {
  code: string;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  voteCount: number;
  percentage: number;
  rank: number;
  isSelected: boolean;
  onVote?: () => void;
  hasVoted: boolean;
  loading?: boolean;
}

function getRankStyle(rank: number): { bg: string; text: string; border: string } {
  switch (rank) {
    case 1:
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-400' };
    case 2:
      return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-400' };
    case 3:
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-400' };
    default:
      return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' };
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ContestantCard({
  code,
  fullName,
  photoUrl,
  bio,
  voteCount,
  percentage,
  rank,
  isSelected,
  onVote,
  hasVoted,
  loading,
}: ContestantCardProps) {
  const rankStyle = getRankStyle(rank);

  return (
    <div
      className={cn(
        'bg-neutral-0 rounded-2xl border-[1.5px] p-4 transition-all duration-200',
        isSelected ? 'border-brand-primary bg-brand-primary-light/30' : 'border-neutral-300'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border',
          rankStyle.bg, rankStyle.text, rankStyle.border
        )}>
          {rank}
        </div>

        {/* Photo */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-neutral-500">{getInitials(fullName)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-neutral-900 truncate">{fullName}</h4>
            {isSelected && <CheckCircle size={16} className="text-brand-primary shrink-0" />}
          </div>
          <p className="text-xs text-neutral-500 font-medium">{code}</p>
          {bio && <p className="text-xs text-neutral-700 line-clamp-1 mt-0.5">{bio}</p>}
        </div>

        {/* Vote info & button */}
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-neutral-900">{voteCount.toLocaleString()}</p>
          <p className="text-xs text-neutral-500">{percentage}%</p>
        </div>
      </div>

      {/* Percentage bar */}
      <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            isSelected ? 'bg-brand-primary' : 'bg-brand-primary/60'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Vote button */}
      {onVote && !hasVoted && (
        <div className="mt-3">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={onVote}
            loading={loading}
          >
            Piga Kura (Vote)
          </Button>
        </div>
      )}

      {isSelected && hasVoted && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-primary">
          <CheckCircle size={14} />
          Umechaguliwa (Selected)
        </div>
      )}
    </div>
  );
}
