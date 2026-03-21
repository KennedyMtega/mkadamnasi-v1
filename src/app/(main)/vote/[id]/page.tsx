'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Flag, Clock, Users, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Toast from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

// Mock vote data
const mockVote = {
  id: '1',
  title: 'Mgahawa Bora Dar es Salaam 2026',
  description: 'Piga kura kwa mgahawa unaoupenda zaidi katika jiji la Dar es Salaam. Kura ni za siri kabisa.',
  category: 'Migahawa',
  totalVotes: 12453,
  isActive: true,
  timeLeft: 'Siku 3 zimebaki',
  createdAt: '2026-03-15',
  options: [
    { id: 'a', title: 'Akemi Revolving Restaurant', votes: 3612, percentage: 29, image: null },
    { id: 'b', title: 'Samaki Samaki', votes: 3113, percentage: 25, image: null },
    { id: 'c', title: 'Chops N Hops', votes: 2490, percentage: 20, image: null },
    { id: 'd', title: 'Cape Town Fish Market', votes: 1868, percentage: 15, image: null },
    { id: 'e', title: 'Mama Safi Kitchen', votes: 1370, percentage: 11, image: null },
  ],
};

export default function VoteDetailPage() {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const vote = mockVote;

  const handleVote = async () => {
    if (!selectedOption) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setHasVoted(true);
    setLoading(false);
    setShowToast(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Kura" showBack rightAction={
        <button className="p-2 rounded-xl hover:bg-neutral-100" aria-label="Shiriki">
          <Share2 size={20} className="text-neutral-700" />
        </button>
      } />

      {/* Desktop back header */}
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
            <Badge variant="orange">{vote.category}</Badge>
            {vote.isActive && (
              <Badge variant="success">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-semantic-success mr-1 animate-pulse-dot" />
                Hai
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">{vote.title}</h1>
          <p className="text-sm text-neutral-700 mb-4">{vote.description}</p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1"><Users size={14} /> {vote.totalVotes.toLocaleString()} kura</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {vote.timeLeft}</span>
            <span className="flex items-center gap-1"><Shield size={14} /> Siri</span>
          </div>
        </Card>

        {/* Anonymity Notice */}
        <div className="flex items-center gap-2 px-3 py-2 bg-semantic-success/10 rounded-xl">
          <Shield size={16} className="text-semantic-success shrink-0" />
          <p className="text-xs text-semantic-success font-medium">Kura yako ni ya siri. Hakuna mtu atakayejua umepiga kura gani.</p>
        </div>

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
                {/* Result bar background */}
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
                      <span className="text-xs text-neutral-500">{option.votes.toLocaleString()}</span>
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
      </div>

      <Toast
        message="Kura yako imehesabiwa! Asante."
        type="success"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
