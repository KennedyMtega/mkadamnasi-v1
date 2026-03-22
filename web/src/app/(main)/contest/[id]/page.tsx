'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Share2,
  Clock,
  Users,
  Trophy,
  Grid3X3,
  List,
  Zap,
  UserPlus,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import Skeleton from '@/components/ui/Skeleton';
import { cn, formatNumber, getAnonymousId } from '@/lib/utils';
import ContestLeaderboard from '@/features/contest/components/ContestLeaderboard';
import VoteByCode from '@/features/contest/components/VoteByCode';
import Link from 'next/link';

interface Contestant {
  id: string;
  code: string;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  voteCount: number;
  percentage: number;
  rank: number;
}

interface ContestData {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: { name: string; icon?: string };
  totalVotes: number;
  contestantCount: number;
  endDate: string | null;
  timeLeft: string | null;
  isFeatured: boolean;
  isActive: boolean;
  boostEnabled: boolean;
  registrationOpen: boolean;
  codePrefix: string;
  contestants: Contestant[];
  hasVoted: boolean;
  userVotedContestantId: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ContestDetailPage() {
  const { id } = useParams();
  const [contest, setContest] = useState<ContestData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [votingLoading, setVotingLoading] = useState(false);
  const [votingContestantId, setVotingContestantId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const anonymousId = getAnonymousId();
    if (anonymousId) headers['x-anonymous-id'] = anonymousId;
    return headers;
  }, []);

  useEffect(() => {
    async function fetchContest() {
      try {
        const res = await fetch(`${BASE_URL}/api/contests/${id}`, { headers: getHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Tatizo la seva');
        setContest(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Tatizo la seva');
      } finally {
        setPageLoading(false);
      }
    }
    if (id) fetchContest();
  }, [id, getHeaders]);

  const handleVote = async (contestantId: string) => {
    if (!contest || votingLoading) return;
    setVotingLoading(true);
    setVotingContestantId(contestantId);
    try {
      const res = await fetch(`${BASE_URL}/api/contests/${contest.id}/vote`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ contestantId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tatizo la seva');

      setContest(prev => prev ? {
        ...prev,
        ...data.data,
        hasVoted: true,
        userVotedContestantId: contestantId,
      } : null);
      setToastMessage('Kura yako imehesabiwa! Asante. (Your vote has been recorded!)');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : 'Tatizo la seva');
      setToastType('error');
      setShowToast(true);
    } finally {
      setVotingLoading(false);
      setVotingContestantId(null);
    }
  };

  const handleVoteByCode = (contestantId: string) => {
    // Refresh the contest data after a successful code vote
    const refetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/contests/${id}`, { headers: getHeaders() });
        const data = await res.json();
        if (res.ok) setContest(data.data);
      } catch { /* ignore */ }
    };
    refetch();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: contest?.title,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage('Kiungo kimenakiliwa! (Link copied!)');
      setToastType('success');
      setShowToast(true);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Mashindano" showBack />
        <div className="space-y-0">
          <Skeleton className="h-48 rounded-none" />
          <div className="px-4 lg:px-6 py-4 space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Mashindano" showBack />
        <div className="px-4 lg:px-6 py-12 text-center">
          <p className="text-neutral-700">{error || 'Mashindano hayakupatikana. (Contest not found.)'}</p>
        </div>
      </div>
    );
  }

  const sortedContestants = [...contest.contestants].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Mashindano" showBack rightAction={
        <button className="p-2 rounded-xl hover:bg-neutral-100" aria-label="Shiriki" onClick={handleShare}>
          <Share2 size={20} className="text-neutral-700" />
        </button>
      } />

      {/* Cover Image Hero */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-brand-primary to-brand-primary-dark overflow-hidden">
        {contest.imageUrl && (
          <img
            src={contest.imageUrl}
            alt={contest.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="orange" size="sm">
              {contest.category.icon ? `${contest.category.icon} ` : ''}{contest.category.name}
            </Badge>
            {contest.isActive && (
              <Badge variant="success" size="sm">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-semantic-success mr-1 animate-pulse-dot" />
                Hai (Active)
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-0">{contest.title}</h1>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {/* Contest Info */}
        <Card>
          {contest.description && (
            <p className="text-sm text-neutral-700 mb-4">{contest.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {formatNumber(contest.totalVotes)} kura (votes)
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={14} />
              {contest.contestantCount} washiriki (contestants)
            </span>
            {contest.timeLeft && (
              <span className="flex items-center gap-1 text-semantic-warning">
                <Clock size={14} />
                {contest.timeLeft}
              </span>
            )}
          </div>
        </Card>

        {/* Already voted notice */}
        {contest.hasVoted && (
          <Card className="bg-semantic-success/10 border-semantic-success/20">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-semantic-success shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Umeshapiga kura (You've already voted)</p>
                <p className="text-xs text-neutral-700">Asante kwa kushiriki. Kura yako imehesabiwa. (Thank you for participating.)</p>
              </div>
            </div>
          </Card>
        )}

        {/* Vote by Code */}
        {contest.isActive && !contest.hasVoted && (
          <VoteByCode
            contestId={contest.id}
            codePrefix={contest.codePrefix}
            onVoteSuccess={handleVoteByCode}
          />
        )}

        {/* View Toggle & Leaderboard */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Orodha ya Washiriki (Leaderboard)
          </h3>
          <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-neutral-0 shadow-sm text-brand-primary' : 'text-neutral-500'
              )}
              aria-label="Orodha (List view)"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-neutral-0 shadow-sm text-brand-primary' : 'text-neutral-500'
              )}
              aria-label="Gridi (Grid view)"
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-2">
            <ContestLeaderboard
              contestants={contest.contestants}
              userVotedContestantId={contest.userVotedContestantId}
              onVote={contest.isActive && !contest.hasVoted ? handleVote : undefined}
              hasVoted={contest.hasVoted}
              votingLoading={votingLoading}
              votingContestantId={votingContestantId}
            />
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sortedContestants.map((contestant, index) => {
              const isSelected = contestant.id === contest.userVotedContestantId;
              return (
                <div
                  key={contestant.id}
                  className={cn(
                    'bg-neutral-0 rounded-2xl border-[1.5px] p-3 text-center transition-all duration-200',
                    isSelected ? 'border-brand-primary bg-brand-primary-light/30' : 'border-neutral-300'
                  )}
                >
                  {/* Rank badge */}
                  <div className="flex justify-center mb-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index === 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-400' :
                      index === 1 ? 'bg-gray-50 text-gray-600 border border-gray-400' :
                      index === 2 ? 'bg-orange-50 text-orange-700 border border-orange-400' :
                      'bg-neutral-100 text-neutral-700 border border-neutral-300'
                    )}>
                      {index + 1}
                    </span>
                  </div>

                  {/* Photo */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 mx-auto mb-2 flex items-center justify-center">
                    {contestant.photoUrl ? (
                      <img src={contestant.photoUrl} alt={contestant.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-neutral-500">{getInitials(contestant.fullName)}</span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">{contestant.fullName}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{contestant.code}</p>
                  <p className="text-sm font-bold text-neutral-900 mt-1">{contestant.voteCount.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">{contestant.percentage}%</p>

                  {/* Percentage bar */}
                  <div className="mt-2 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        isSelected ? 'bg-brand-primary' : 'bg-brand-primary/60'
                      )}
                      style={{ width: `${contestant.percentage}%` }}
                    />
                  </div>

                  {isSelected && contest.hasVoted && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-brand-primary">
                      <CheckCircle size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Boost Vote CTA */}
        {contest.boostEnabled && contest.hasVoted && (
          <Button className="w-full" icon={<Zap size={18} />}>
            Ongeza Nguvu ya Kura (Boost Vote)
          </Button>
        )}

        {/* Registration Link */}
        {contest.registrationOpen && (
          <Link href={`/contest/${contest.id}/register`}>
            <Card className="hover:border-brand-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
                  <UserPlus size={20} className="text-brand-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">Usajili wa Washiriki (Contestant Registration)</p>
                  <p className="text-xs text-neutral-500">Jiandikishe kushiriki mashindano haya (Register to participate)</p>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Share */}
        <Button variant="secondary" className="w-full" icon={<Share2 size={18} />} onClick={handleShare}>
          Shiriki Mashindano (Share Contest)
        </Button>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
