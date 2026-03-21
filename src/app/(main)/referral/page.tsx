'use client';

import { useState, useEffect, useCallback } from 'react';
import { Share2, Copy, Check, Users, Gift, ChevronRight, Trophy } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';

interface ReferralTier {
  name: string;
  nameEn: string;
  minReferrals: number;
  maxReferrals: number | null;
}

interface ReferralEntry {
  id: string;
  pointsAwarded: number;
  createdAt: string;
  referredUsername: string;
}

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  totalPoints: number;
  tier: ReferralTier;
  referrals: ReferralEntry[];
}

const TIERS = [
  { name: 'Shaba', nameEn: 'Bronze', min: 0, max: 4, color: '#CD7F32', icon: '🥉' },
  { name: 'Fedha', nameEn: 'Silver', min: 5, max: 14, color: '#C0C0C0', icon: '🥈' },
  { name: 'Dhahabu', nameEn: 'Gold', min: 15, max: 29, color: '#FFD700', icon: '🥇' },
  { name: 'Almasi', nameEn: 'Diamond', min: 30, max: null, color: '#B9F2FF', icon: '💎' },
];

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getReferralStats();
      setStats(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo limetokea');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const referralLink = stats
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://mkadamnasi.co.tz'}/?ref=${stats.referralCode}`
    : '';

  const handleCopyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!referralLink) return;
    const text = encodeURIComponent(
      `Jiunge na Mkadamnasi - jukwaa la kupiga kura na kukadiria huduma Tanzania! Tumia nambari yangu ya rufaa: ${stats?.referralCode}\n\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Current tier info
  const currentTier = TIERS.find((t) => t.name === stats?.tier.name) || TIERS[0];
  const currentTierIndex = TIERS.indexOf(currentTier);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  const totalReferrals = stats?.totalReferrals ?? 0;

  // Progress to next tier
  const progressToNext = nextTier
    ? ((totalReferrals - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;
  const referralsToNext = nextTier ? nextTier.min - totalReferrals : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Rufaa" showBack />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Mpango wa Rufaa</h1>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : error ? (
          <Card className="text-center py-8">
            <p className="text-semantic-error font-medium">Tatizo limetokea</p>
            <p className="text-sm text-neutral-500 mt-1">{error}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={fetchStats}>
              Jaribu tena
            </Button>
          </Card>
        ) : stats ? (
          <>
            {/* Referral Code Card */}
            <Card elevated className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-neutral-0">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-neutral-0/20 flex items-center justify-center mx-auto">
                  <Share2 size={28} className="text-neutral-0" />
                </div>
                <div>
                  <p className="text-sm text-neutral-0/80">Nambari yako ya rufaa</p>
                  <p className="text-3xl font-bold tracking-wider mt-1">{stats.referralCode}</p>
                </div>
                <p className="text-xs text-neutral-0/70">
                  Shiriki nambari hii na marafiki. Pata pointi 10 kwa kila rufaa!
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={copied ? <Check size={16} /> : <Copy size={16} />}
                    onClick={handleCopyLink}
                    className="flex-1 !bg-neutral-0/20 !text-neutral-0 !border-neutral-0/30 hover:!bg-neutral-0/30"
                  >
                    {copied ? 'Imenakiliwa!' : 'Nakili kiungo'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Share2 size={16} />}
                    onClick={handleShareWhatsApp}
                    className="flex-1 !bg-[#25D366] !text-neutral-0 !border-[#25D366] hover:!bg-[#20BD5A]"
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <div className="text-center">
                  <Users size={22} className="text-brand-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalReferrals}</p>
                  <p className="text-xs text-neutral-500">Jumla ya rufaa</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <Gift size={22} className="text-semantic-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalPoints}</p>
                  <p className="text-xs text-neutral-500">Pointi zilizopatikana</p>
                </div>
              </Card>
            </div>

            {/* Tier Card */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{currentTier.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neutral-900">{currentTier.name}</h3>
                    <Badge variant="orange" size="sm">{currentTier.nameEn}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Kiwango chako cha rufaa
                  </p>
                </div>
                <Trophy size={20} className="text-neutral-300" />
              </div>

              {nextTier ? (
                <div className="space-y-2">
                  <ProgressBar
                    value={Math.min(progressToNext, 100)}
                    max={100}
                    label={`Rufaa ${totalReferrals} / ${nextTier.min}`}
                    showPercentage
                    color={currentTier.color}
                  />
                  <p className="text-xs text-neutral-500 text-center">
                    Rufaa {referralsToNext} zaidi hadi <span className="font-semibold">{nextTier.name} ({nextTier.nameEn})</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-semantic-success font-medium text-center">
                  Umefika kiwango cha juu! Hongera!
                </p>
              )}

              {/* All tiers */}
              <div className="mt-4 grid grid-cols-4 gap-1">
                {TIERS.map((tier) => {
                  const isActive = tier.name === currentTier.name;
                  const isPast = TIERS.indexOf(tier) < currentTierIndex;
                  return (
                    <div
                      key={tier.name}
                      className={`text-center p-2 rounded-xl ${
                        isActive
                          ? 'bg-brand-primary-light border border-brand-primary'
                          : isPast
                          ? 'bg-neutral-100'
                          : 'bg-neutral-100 opacity-50'
                      }`}
                    >
                      <span className="text-lg">{tier.icon}</span>
                      <p className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-brand-primary' : 'text-neutral-600'}`}>
                        {tier.name}
                      </p>
                      <p className="text-[9px] text-neutral-500">
                        {tier.max !== null ? `${tier.min}-${tier.max}` : `${tier.min}+`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Referrals */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2 px-1">
                Rufaa za hivi karibuni
              </h3>
              {stats.referrals.length === 0 ? (
                <Card className="text-center py-6">
                  <Users size={32} className="text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-700 font-medium">Bado huna rufaa</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Shiriki nambari yako ili kupata pointi
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {stats.referrals.map((referral) => (
                    <Card key={referral.id} padding="sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-primary-light flex items-center justify-center">
                            <Users size={14} className="text-brand-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {referral.referredUsername}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatDate(referral.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">
                          +{referral.pointsAwarded} pointi
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* How it works */}
            <Card>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Jinsi inavyofanya kazi</h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Shiriki nambari yako ya rufaa na marafiki' },
                  { step: '2', text: 'Rafiki yako anajiunga na Mkadamnasi' },
                  { step: '3', text: 'Wewe unapata pointi 10, rafiki yako pointi 5' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-primary text-neutral-0 flex items-center justify-center text-xs font-bold shrink-0">
                      {item.step}
                    </div>
                    <p className="text-sm text-neutral-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
