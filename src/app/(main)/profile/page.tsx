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
import StarRating from '@/components/ui/StarRating';

const mockUser = {
  username: 'Mtumiaji_2847',
  points: 2350,
  level: 12,
  nextLevel: 3000,
  votesCast: 156,
  ratingsGiven: 89,
  votesCreated: 12,
  badges: [
    { id: '1', name: 'Mpiga Kura', icon: '🗳️', earned: true },
    { id: '2', name: 'Mkadiriaji', icon: '⭐', earned: true },
    { id: '3', name: 'Muundaji', icon: '✨', earned: true },
    { id: '4', name: 'Mpiganaji', icon: '🔥', earned: false },
  ],
  recentActivity: [
    { id: '1', type: 'vote_cast', title: 'Ulipiga kura: Mgahawa Bora Dar', time: 'Saa 2 zilizopita' },
    { id: '2', type: 'rating_given', title: 'Ulikadiria: Hyatt Regency (⭐5)', time: 'Jana' },
    { id: '3', type: 'vote_created', title: 'Uliunda: Saluni Bora Mwanza', time: 'Siku 3 zilizopita' },
  ],
};

export default function ProfilePage() {
  const [tab, setTab] = useState<'overview' | 'badges' | 'history'>('overview');

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
        {/* Profile Card */}
        <Card elevated>
          <div className="flex items-center gap-4 mb-4">
            <Avatar anonymous size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900">{mockUser.username}</h2>
                <Badge variant="success" size="sm">
                  <Shield size={10} className="mr-0.5" /> Siri
                </Badge>
              </div>
              <p className="text-sm text-neutral-500 mt-0.5">Kiwango {mockUser.level}</p>
              <ProgressBar
                value={mockUser.points}
                max={mockUser.nextLevel}
                label={`${mockUser.points} / ${mockUser.nextLevel} pointi`}
                showPercentage
                className="mt-2"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-neutral-100">
              <Vote size={18} className="text-brand-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-neutral-900">{mockUser.votesCast}</p>
              <p className="text-[10px] text-neutral-500">Kura</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-neutral-100">
              <Star size={18} className="text-semantic-warning mx-auto mb-1" />
              <p className="text-lg font-bold text-neutral-900">{mockUser.ratingsGiven}</p>
              <p className="text-[10px] text-neutral-500">Makadirio</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-neutral-100">
              <TrendingUp size={18} className="text-semantic-success mx-auto mb-1" />
              <p className="text-lg font-bold text-neutral-900">{mockUser.votesCreated}</p>
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
          </>
        )}

        {tab === 'badges' && (
          <div className="grid grid-cols-2 gap-3">
            {mockUser.badges.map((badge) => (
              <Card key={badge.id} className={badge.earned ? '' : 'opacity-50'}>
                <div className="text-center">
                  <span className="text-3xl">{badge.icon}</span>
                  <p className="text-sm font-semibold text-neutral-900 mt-2">{badge.name}</p>
                  <Badge variant={badge.earned ? 'success' : 'default'} size="sm" className="mt-1">
                    {badge.earned ? 'Umeipata' : 'Haijafunguliwa'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2">
            {mockUser.recentActivity.map((item) => (
              <Card key={item.id} padding="sm">
                <p className="text-sm text-neutral-900">{item.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{item.time}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
