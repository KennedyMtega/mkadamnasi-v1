'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Flag, Clock, Users, Shield, CheckCircle, Link, QrCode, Copy, Check } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { CommentSection } from '@/features/comments/components/CommentSection';

interface VoteOption {
  id: string;
  title: string;
  voteCount: number;
  percentage: number;
}

interface VoteData {
  id: string;
  title: string;
  description: string | null;
  category: { name: string };
  totalVotes: number;
  isActive: boolean;
  isPublic: boolean;
  visibility: string;
  timeLeft: string | null;
  options: VoteOption[];
  hasVoted: boolean;
  userVoteOptionId: string | null;
  inviteCode: string | null;
  isCreator: boolean;
}

export default function VoteDetailPage() {
  const { id } = useParams();
  const [vote, setVote] = useState<VoteData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (vote?.inviteCode) {
      navigator.clipboard.writeText(vote.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyInviteLink = () => {
    if (vote?.inviteCode) {
      const link = `${window.location.origin}/vote/${vote.id}?code=${vote.inviteCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    async function fetchVote() {
      try {
        const res = await api.getVote(id as string);
        setVote(res.data);
        if (res.data.hasVoted) {
          setHasVoted(true);
          setSelectedOption(res.data.userVoteOptionId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Tatizo la seva');
      } finally {
        setPageLoading(false);
      }
    }
    if (id) fetchVote();
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption || !vote) return;
    setLoading(true);
    try {
      const res = await api.castVote(vote.id, selectedOption);
      setVote(res.data);
      setHasVoted(true);
      setToastMessage(res.message || 'Kura yako imehesabiwa! Asante.');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : 'Tatizo la seva');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Kura" showBack />
        <div className="px-4 lg:px-6 py-4 space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !vote) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Kura" showBack />
        <div className="px-4 lg:px-6 py-12 text-center">
          <p className="text-neutral-700">{error || 'Kura haikupatikana.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Kura" showBack rightAction={
        <button className="p-2 rounded-xl hover:bg-neutral-100" aria-label="Shiriki">
          <Share2 size={20} className="text-neutral-700" />
        </button>
      } />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Kura</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-neutral-100">
            <Share2 size={20} className="text-neutral-700" />
          </button>
          <button className="p-2 rounded-xl hover:bg-neutral-100">
            <Flag size={20} className="text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {/* Vote Info */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="orange">{vote.category.name}</Badge>
            {vote.isActive && (
              <Badge variant="success">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-semantic-success mr-1 animate-pulse-dot" />
                Hai
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">{vote.title}</h1>
          {vote.description && (
            <p className="text-sm text-neutral-700 mb-4">{vote.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1"><Users size={14} /> {vote.totalVotes.toLocaleString()} kura</span>
            {vote.timeLeft && (
              <span className="flex items-center gap-1"><Clock size={14} /> {vote.timeLeft}</span>
            )}
            <span className="flex items-center gap-1"><Shield size={14} /> Siri</span>
          </div>
        </Card>

        {/* Anonymity Notice */}
        <div className="flex items-center gap-2 px-3 py-2 bg-semantic-success/10 rounded-xl">
          <Shield size={16} className="text-semantic-success shrink-0" />
          <p className="text-xs text-semantic-success font-medium">Kura yako ni ya siri. Hakuna mtu atakayejua umepiga kura gani.</p>
        </div>

        {/* Private Poll Sharing (visible to creator) */}
        {vote.inviteCode && vote.isCreator && (
          <Card>
            <div className="flex items-center gap-2 mb-3">
              {vote.visibility === 'qr_only' ? (
                <QrCode size={18} className="text-brand-primary" />
              ) : (
                <Link size={18} className="text-brand-primary" />
              )}
              <p className="text-sm font-semibold text-neutral-900">
                {vote.visibility === 'qr_only' ? 'Shiriki kwa QR Code' : 'Shiriki kwa Msimbo'}
              </p>
              <Badge variant="warning">
                {vote.visibility === 'qr_only' ? 'QR Tu' : 'Mwaliko Tu'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 rounded-xl p-3">
              <code className="flex-1 text-sm font-mono font-bold text-neutral-900 tracking-widest">
                {vote.inviteCode}
              </code>
              <button
                onClick={copyInviteCode}
                className="p-2 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                {copied ? <Check size={18} className="text-semantic-success" /> : <Copy size={18} className="text-neutral-500" />}
              </button>
            </div>

            <button
              onClick={copyInviteLink}
              className="w-full mt-2 text-xs text-brand-primary font-medium py-2 hover:underline"
            >
              Nakili kiungo cha mwaliko
            </button>
          </Card>
        )}

        {/* Private poll notice for non-creators */}
        {!vote.isPublic && !vote.isCreator && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
            <Link size={16} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">Kura hii ni ya faragha — inapatikana tu kwa waalikwa.</p>
          </div>
        )}

        {/* Vote Options */}
        <div className="space-y-2.5">
          {vote.options.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => !hasVoted && setSelectedOption(option.id)}
                disabled={hasVoted}
                className={cn(
                  'w-full text-left rounded-xl border-[1.5px] p-4 transition-all duration-200 relative overflow-hidden',
                  isSelected && !hasVoted && 'border-brand-primary bg-brand-primary-light',
                  !isSelected && !hasVoted && 'border-neutral-300 bg-neutral-0 hover:border-neutral-300',
                  hasVoted && 'border-neutral-300 bg-neutral-0 cursor-default'
                )}
              >
                {hasVoted && (
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-primary-light/60 transition-all duration-1000 rounded-xl"
                    style={{ width: `${option.percentage}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!hasVoted && (
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                        isSelected ? 'border-brand-primary bg-brand-primary' : 'border-neutral-300'
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-neutral-0" />}
                      </div>
                    )}
                    {hasVoted && isSelected && (
                      <CheckCircle size={20} className="text-brand-primary shrink-0" />
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-neutral-900' : 'text-neutral-700'
                    )}>
                      {option.title}
                    </span>
                  </div>
                  {hasVoted && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">{option.voteCount.toLocaleString()}</span>
                      <span className="text-sm font-bold text-neutral-900">{option.percentage}%</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Vote Button */}
        {!hasVoted && (
          <Button
            className="w-full"
            disabled={!selectedOption}
            loading={loading}
            onClick={handleVote}
          >
            Piga Kura
          </Button>
        )}

        {/* After voting */}
        {hasVoted && (
          <div className="space-y-3">
            <Card className="bg-semantic-success/10 border-semantic-success/20">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-semantic-success" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Umepiga kura!</p>
                  <p className="text-xs text-neutral-700">Asante kwa kushiriki. Kura yako imehesabiwa.</p>
                </div>
              </div>
            </Card>
            <Button variant="secondary" className="w-full" icon={<Share2 size={18} />}>
              Shiriki Matokeo
            </Button>
          </div>
        )}

        {/* Comments */}
        <CommentSection targetId={id as string} targetType="vote" />
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
