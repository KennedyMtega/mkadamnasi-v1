'use client';

import { useState } from 'react';
import { Shield, Award, TrendingUp, Star, Vote, Edit, ChevronRight, Share2, Crown } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import Chip from '@/components/ui/Chip';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const [tab, setTab] = useState<'overview' | 'badges' | 'history'>('overview');
  const { profile, stats, loading, error } = useProfile();
  const { activities } = useActivity({ limit: 5 });

  const username = profile?.username || 'Mtumiaji Siri';
  const points = stats?.points ?? 0;
  const level = stats?.level ?? 1;
  const nextLevelPoints = stats?.nextLevelPoints ?? 250;
  const votesCast = stats?.votesCast ?? 0;
  const ratingsGiven = stats?.ratingsGiven ?? 0;
  const votesCreated = stats?.votesCreated ?? 0;
  const badges = stats?.badges ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Wasifu" rightAction={
        <button className="p-2 rounded-xl hover:bg-neutral-100">
          <Edit size={20} className="text-neutral-700" />
        </button>
      } />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Wasifu Wangu</h1>
        <Button variant="secondary" size="sm" icon={<Edit size={16} />}>Hariri</Button>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <Card className="text-center py-8">
            <p className="text-semantic-error font-medium">Tatizo limetokea</p>
            <p className="text-sm text-neutral-500 mt-1">{error}</p>
          </Card>
        ) : (
          <>
            {/* Profile Card */}
            <Card elevated>
              <div className="flex items-center gap-4 mb-4">
                <Avatar anonymous size="xl" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900">{username}</h2>
                    <Badge variant="success" size="sm">
                      <Shield size={10} className="mr-0.5" /> Siri
                    </Badge>
                    {profile?.isVerified && (
                      <Badge variant="info" size="sm">Imethibitishwa</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-0.5">Kiwango {level}</p>
                  {profile?.bio && (
                    <p className="text-xs text-neutral-600 mt-1">{profile.bio}</p>
                  )}
                  <ProgressBar
                    value={points}
                    max={nextLevelPoints}
                    label={`${points} / ${nextLevelPoints} pointi`}
                    showPercentage
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-neutral-100">
                  <Vote size={18} className="text-brand-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-neutral-900">{votesCast}</p>
                  <p className="text-[10px] text-neutral-500">Kura</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-neutral-100">
                  <Star size={18} className="text-semantic-warning mx-auto mb-1" />
                  <p className="text-lg font-bold text-neutral-900">{ratingsGiven}</p>
                  <p className="text-[10px] text-neutral-500">Makadirio</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-neutral-100">
                  <TrendingUp size={18} className="text-semantic-success mx-auto mb-1" />
                  <p className="text-lg font-bold text-neutral-900">{votesCreated}</p>
                  <p className="text-[10px] text-neutral-500">Zilizounda</p>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
              {(['overview', 'badges', 'history'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-neutral-0 text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
                >
                  {t === 'overview' ? 'Muhtasari' : t === 'badges' ? 'Beji' : 'Historia'}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <>
                {/* Premium Upsell */}
                {!profile?.isPremium && (
                  <Card className="bg-gradient-to-r from-neutral-900 to-neutral-700 text-neutral-0">
                    <div className="flex items-center gap-3">
                      <Crown size={24} className="text-semantic-warning" />
                      <div className="flex-1">
                        <p className="font-semibold">Mkadamnasi Premium</p>
                        <p className="text-xs text-neutral-0/70">Fungua vipengele zaidi</p>
                      </div>
                      <ChevronRight size={18} className="text-neutral-0/50" />
                    </div>
                  </Card>
                )}

                {/* Referral */}
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Share2 size={20} className="text-brand-primary" />
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Rufaa Marafiki</p>
                        <p className="text-xs text-neutral-500">Pata pointi 50 kwa kila rufaa</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-neutral-300" />
                  </div>
                </Card>

                {/* Region & Language info */}
                {(profile?.region || profile?.language) && (
                  <Card>
                    <div className="space-y-2">
                      {profile.region && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Mkoa</span>
                          <span className="text-neutral-900 font-medium">{profile.region}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Lugha</span>
                        <span className="text-neutral-900 font-medium">
                          {profile?.language === 'sw' ? 'Kiswahili' : 'English'}
                        </span>
                      </div>
                      {stats?.streak !== undefined && stats.streak > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Mfululizo</span>
                          <span className="text-neutral-900 font-medium">{stats.streak} siku</span>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </>
            )}

            {tab === 'badges' && (
              badges.length === 0 ? (
                <Card className="text-center py-8">
                  <Award size={40} className="text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-700 font-medium">Bado huna beji</p>
                  <p className="text-sm text-neutral-500 mt-1">Endelea kupiga kura na kukadiria ili kupata beji</p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <Card key={badge.id}>
                      <div className="text-center">
                        <span className="text-3xl">{badge.icon}</span>
                        <p className="text-sm font-semibold text-neutral-900 mt-2">{badge.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{badge.description}</p>
                        <Badge variant="success" size="sm" className="mt-1">
                          Umeipata
                        </Badge>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          {formatDate(badge.earnedAt)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )
            )}

            {tab === 'history' && (
              activities.length === 0 ? (
                <Card className="text-center py-8">
                  <p className="text-neutral-700 font-medium">Hakuna historia bado</p>
                  <p className="text-sm text-neutral-500 mt-1">Shughuli zako zitaonekana hapa</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {activities.map((item) => (
                    <Card key={item.id} padding="sm">
                      <p className="text-sm text-neutral-900">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-neutral-600 mt-0.5">{item.description}</p>
                      )}
                      <p className="text-xs text-neutral-500 mt-0.5">{formatDate(item.createdAt)}</p>
                    </Card>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
