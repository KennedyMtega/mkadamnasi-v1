'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Flag, MapPin, Star, Users, Shield, CheckCircle, MessageSquare } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import Toast from '@/components/ui/Toast';
import { getRatingColor, getRatingLabel, formatNumber } from '@/lib/utils';

const mockRating = {
  id: '1',
  name: 'Hyatt Regency Dar es Salaam',
  category: 'Migahawa',
  region: 'Dar es Salaam',
  description: 'Mgahawa wa kiwango cha juu katikati ya jiji la Dar es Salaam, unaojulikana kwa vyakula vya kimataifa na mazingira mazuri.',
  averageRating: 4.7,
  totalRatings: 2341,
  distribution: { 5: 1580, 4: 468, 3: 187, 2: 70, 1: 36 },
  recentReviews: [
    { id: 'r1', score: 5, review: 'Mazingira mazuri sana na huduma bora. Chakula kitamu!', createdAt: '2026-03-18' },
    { id: 'r2', score: 4, review: 'Nzuri lakini bei ni juu kidogo.', createdAt: '2026-03-16' },
    { id: 'r3', score: 5, review: 'Best restaurant in Dar! Highly recommended.', createdAt: '2026-03-15' },
  ],
};

const RATING_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#34D399', '#10B981'];

export default function RatingDetailPage() {
  const { id } = useParams();
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = mockRating;

  const handleSubmitRating = async () => {
    if (userRating === 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setHasRated(true);
    setLoading(false);
    setShowToast(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Kadirio" showBack rightAction={
        <button className="p-2 rounded-xl hover:bg-neutral-100">
          <Share2 size={20} className="text-neutral-700" />
        </button>
      } />

      <div className="hidden lg:flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Kadirio</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-neutral-100"><Share2 size={20} className="text-neutral-700" /></button>
          <button className="p-2 rounded-xl hover:bg-neutral-100"><Flag size={20} className="text-neutral-700" /></button>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {/* Entity Info */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="orange">{data.category}</Badge>
            <Badge variant="info"><MapPin size={10} className="mr-0.5" />{data.region}</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">{data.name}</h1>
          <p className="text-sm text-neutral-700 mb-4">{data.description}</p>

          {/* Rating Summary */}
          <div className="flex items-start gap-6 pt-4 border-t border-neutral-300">
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: getRatingColor(data.averageRating) }}>
                {data.averageRating}
              </div>
              <StarRating rating={data.averageRating} size="sm" />
              <p className="text-xs text-neutral-500 mt-1">{formatNumber(data.totalRatings)} makadirio</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-700 w-4 text-right">{star}</span>
                  <Star size={12} fill={RATING_COLORS[star - 1]} stroke={RATING_COLORS[star - 1]} />
                  <ProgressBar
                    value={data.distribution[star as keyof typeof data.distribution]}
                    max={data.totalRatings}
                    color={RATING_COLORS[star - 1]}
                    size="sm"
                    className="flex-1"
                  />
                  <span className="text-xs text-neutral-500 w-10 text-right">
                    {Math.round((data.distribution[star as keyof typeof data.distribution] / data.totalRatings) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Rate Section */}
        {!hasRated ? (
          <Card elevated>
            <h2 className="text-base font-bold text-neutral-900 mb-1">Kadiria Sasa</h2>
            <p className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
              <Shield size={12} className="text-semantic-success" /> Kadirio lako ni la siri
            </p>

            <div className="flex justify-center mb-4">
              <StarRating
                rating={userRating}
                size="xl"
                interactive
                onChange={setUserRating}
                showLabel
              />
            </div>

            {userRating > 0 && (
              <div className="mb-4">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Andika maoni yako (si lazima)..."
                  className="w-full h-24 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-0 p-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none transition-colors"
                  maxLength={500}
                />
                <p className="text-right text-xs text-neutral-500 mt-1">{review.length}/500</p>
              </div>
            )}

            <Button
              className="w-full"
              disabled={userRating === 0}
              loading={loading}
              onClick={handleSubmitRating}
            >
              Tuma Kadirio
            </Button>
          </Card>
        ) : (
          <Card className="bg-semantic-success/10 border-semantic-success/20">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-semantic-success" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Kadirio lako limehifadhiwa!</p>
                <p className="text-xs text-neutral-700">Asante kwa maoni yako ya siri.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Reviews */}
        <div>
          <h2 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <MessageSquare size={18} />
            Maoni ya Hivi Karibuni
          </h2>
          <div className="space-y-3">
            {data.recentReviews.map((r) => (
              <Card key={r.id} padding="sm">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar anonymous size="sm" />
                  <span className="text-xs text-neutral-500">Mtumiaji wa Siri</span>
                  <span className="text-xs text-neutral-500">•</span>
                  <StarRating rating={r.score} size="sm" />
                </div>
                <p className="text-sm text-neutral-700">{r.review}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Toast
        message="Kadirio lako limehifadhiwa! Asante."
        type="success"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
