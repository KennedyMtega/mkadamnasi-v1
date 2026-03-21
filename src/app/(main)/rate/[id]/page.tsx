'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Flag, MapPin, Star, Shield, CheckCircle, MessageSquare } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import Toast from '@/components/ui/Toast';
import Skeleton from '@/components/ui/Skeleton';
import { getRatingColor, formatNumber } from '@/lib/utils';
import { api } from '@/lib/api-client';

const RATING_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#34D399', '#10B981'];

interface RatingData {
  id: string;
  title: string;
  description: string | null;
  entityName: string;
  category: { name: string };
  region: string | null;
  averageRating: number;
  totalRatings: number;
  distribution: Record<string, number>;
  hasRated: boolean;
  userScore: number | null;
  recentReviews: Array<{
    id: string;
    score: number;
    review: string | null;
    createdAt: string;
  }>;
}

export default function RatingDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<RatingData | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await api.getRating(id as string);
        setData(res.data);
        if (res.data.hasRated) {
          setHasRated(true);
          if (res.data.userScore) setUserRating(res.data.userScore);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Tatizo la seva');
      } finally {
        setPageLoading(false);
      }
    }
    if (id) fetchRating();
  }, [id]);

  const handleSubmitRating = async () => {
    if (userRating === 0 || !data) return;
    setLoading(true);
    try {
      const res = await api.submitRating(data.id, userRating, review || undefined);
      setData({
        ...data,
        averageRating: res.data.averageRating,
        totalRatings: res.data.totalRatings,
        distribution: res.data.distribution,
        hasRated: true,
        userScore: userRating,
      });
      setHasRated(true);
      setToastMessage(res.message || 'Kadirio lako limehifadhiwa! Asante.');
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
        <TopBar title="Kadirio" showBack />
        <div className="px-4 lg:px-6 py-4 space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Kadirio" showBack />
        <div className="px-4 lg:px-6 py-12 text-center">
          <p className="text-neutral-700">{error || 'Kadirio halikupatikana.'}</p>
        </div>
      </div>
    );
  }

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
            <Badge variant="orange">{data.category.name}</Badge>
            {data.region && (
              <Badge variant="info"><MapPin size={10} className="mr-0.5" />{data.region}</Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">{data.entityName}</h1>
          {data.description && (
            <p className="text-sm text-neutral-700 mb-4">{data.description}</p>
          )}

          {/* Rating Summary */}
          <div className="flex items-start gap-6 pt-4 border-t border-neutral-300">
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: getRatingColor(data.averageRating) }}>
                {data.averageRating.toFixed(1)}
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
                    value={data.distribution[star.toString()] || 0}
                    max={data.totalRatings || 1}
                    color={RATING_COLORS[star - 1]}
                    size="sm"
                    className="flex-1"
                  />
                  <span className="text-xs text-neutral-500 w-10 text-right">
                    {data.totalRatings > 0
                      ? Math.round(((data.distribution[star.toString()] || 0) / data.totalRatings) * 100)
                      : 0}%
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
        {data.recentReviews.length > 0 && (
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
        )}
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
