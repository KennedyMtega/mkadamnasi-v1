'use client';

import { cn } from '@/lib/utils';
import type { Contestant } from '../hooks/useContest';
import ContestantCard from './ContestantCard';

interface ContestLeaderboardProps {
  contestants: Contestant[];
  userVotedContestantId: string | null;
  onVote?: (contestantId: string) => void;
  hasVoted: boolean;
  votingLoading?: boolean;
  votingContestantId?: string | null;
}

export default function ContestLeaderboard({
  contestants,
  userVotedContestantId,
  onVote,
  hasVoted,
  votingLoading,
  votingContestantId,
}: ContestLeaderboardProps) {
  const sorted = [...contestants].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="space-y-2.5">
      <h3 className="text-base font-bold text-neutral-900">
        Orodha ya Washiriki (Leaderboard)
      </h3>
      <div className="space-y-2">
        {sorted.map((contestant, index) => (
          <div
            key={contestant.id}
            className="transition-all duration-300"
            style={{ transitionProperty: 'transform, opacity' }}
          >
            <ContestantCard
              code={contestant.code}
              fullName={contestant.fullName}
              photoUrl={contestant.photoUrl}
              bio={contestant.bio}
              voteCount={contestant.voteCount}
              percentage={contestant.percentage}
              rank={index + 1}
              isSelected={contestant.id === userVotedContestantId}
              onVote={onVote ? () => onVote(contestant.id) : undefined}
              hasVoted={hasVoted}
              loading={votingLoading && votingContestantId === contestant.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
