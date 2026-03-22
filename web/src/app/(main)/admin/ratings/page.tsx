'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import { getAnonymousId, formatDate, formatNumber } from '@/lib/utils';
import {
  Star,
  StarIcon,
  Archive,
  Trash2,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Flag,
} from 'lucide-react';

interface RatingItem {
  id: string;
  title: string;
  description: string | null;
  entityName: string;
  entityType: string;
  averageRating: number;
  totalRatings: number;
  viewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  status: string;
  flagCount: number;
  createdAt: string;
  category: { name: string; nameEn: string; icon: string };
  creator: { id: string; username: string | null; anonymousId: string };
  _count: { entries: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const filterTabs = [
  { id: 'all', label: 'Zote (All)' },
  { id: 'active', label: 'Hai (Active)' },
  { id: 'featured', label: 'Zilizoangaziwa (Featured)' },
  { id: 'flagged', label: 'Zilizoripotiwa (Flagged)' },
  { id: 'archived', label: 'Zilizohifadhiwa (Archived)' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <Badge variant="success">Hai (Active)</Badge>;
    case 'FLAGGED': return <Badge variant="warning">Imeripotiwa (Flagged)</Badge>;
    case 'ARCHIVED': return <Badge variant="default">Imehifadhiwa (Archived)</Badge>;
    case 'REMOVED': return <Badge variant="error">Imeondolewa (Removed)</Badge>;
    case 'PENDING_REVIEW': return <Badge variant="info">Inasubiri (Pending)</Badge>;
    default: return <Badge variant="default">{status}</Badge>;
  }
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-neutral-900 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{ id: string; action: string; title: string }>({ id: '', action: '', title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });

  const fetchRatings = useCallback(async (page = 1) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        type: 'ratings',
        page: String(page),
        limit: '20',
        filter,
      });
      const res = await fetch(`/api/admin/content?${params}`, {
        headers: { 'x-anonymous-id': getAnonymousId() },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRatings(data.items);
      setPagination(data.pagination);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRatings(1);
  }, [fetchRatings]);

  const executeAction = async (id: string, action: string) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({ type: 'rating', id, action }),
      });
      if (!res.ok) throw new Error('Failed');

      const actionLabels: Record<string, string> = {
        feature: 'imeangaziwa (featured)',
        unfeature: 'imeondolewa kwenye maarufu (unfeatured)',
        archive: 'imehifadhiwa (archived)',
        activate: 'imeanzishwa upya (activated)',
        remove: 'imeondolewa (removed)',
      };

      setToast({
        message: `Tathmini ${actionLabels[action] || 'imebadilishwa'}`,
        type: 'success',
        visible: true,
      });
      fetchRatings(pagination.page);
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena.', type: 'error', visible: true });
    }
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    await executeAction(confirmData.id, confirmData.action);
    setActionLoading(false);
    setConfirmOpen(false);
  };

  const openDangerConfirm = (id: string, action: string, title: string) => {
    setConfirmData({ id, action, title });
    setConfirmOpen(true);
  };

  const getConfirmMessage = () => {
    if (confirmData.action === 'remove') {
      return `Una uhakika unataka kuondoa tathmini "${confirmData.title}"? (Are you sure you want to remove this rating?)`;
    }
    return `Una uhakika unataka kuhifadhi tathmini "${confirmData.title}"? (Are you sure you want to archive this rating?)`;
  };

  if (error) return <ErrorState onRetry={() => fetchRatings(1)} />;

  return (
    <div className="space-y-4">
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmData.action === 'remove' ? 'Ondoa Tathmini (Remove Rating)' : 'Hifadhi Tathmini (Archive Rating)'}
        message={getConfirmMessage()}
        confirmLabel={confirmData.action === 'remove' ? 'Ondoa (Remove)' : 'Hifadhi (Archive)'}
        variant="danger"
        loading={actionLoading}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tathmini (Ratings)</h1>
        <p className="text-sm text-neutral-500 mt-1">Simamia tathmini zote za jukwaa (Manage all platform ratings)</p>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto -mx-4 px-4">
        <Tabs tabs={filterTabs} activeTab={filter} onChange={(id) => setFilter(id)} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="space-y-2">
                <Skeleton variant="text" className="w-3/4 h-5" />
                <Skeleton variant="text" className="w-1/2 h-4" />
                <div className="flex gap-2">
                  <Skeleton variant="rectangular" className="w-24 h-5" />
                  <Skeleton variant="rectangular" className="w-16 h-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : ratings.length === 0 ? (
        <EmptyState
          icon={<StarIcon size={32} />}
          title="Hakuna tathmini (No ratings found)"
          description="Hakuna tathmini zinazolingana na chujio lako (No ratings match your filter)"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <Card padding="sm" className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Kitu (Entity)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Kundi (Category)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Tathmini (Rating)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Jumla (Total)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Hali (Status)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Tarehe (Date)</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Vitendo (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((rating) => (
                    <tr key={rating.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-neutral-900 truncate">{rating.entityName}</p>
                          <p className="text-xs text-neutral-400 mt-0.5 truncate">{rating.title}</p>
                          <p className="text-[11px] text-neutral-400 capitalize">{rating.entityType}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-neutral-600">
                          {rating.category.icon} {rating.category.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <RatingStars rating={rating.averageRating} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-neutral-900">{formatNumber(rating.totalRatings)}</span>
                          <span className="text-xs text-neutral-400">
                            <Eye size={12} className="inline mr-0.5" />{formatNumber(rating.viewCount)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {statusBadge(rating.status)}
                          {rating.isFeatured && <Badge variant="orange">Maarufu</Badge>}
                          {rating.flagCount > 0 && (
                            <Badge variant="warning">
                              <Flag size={10} className="mr-0.5 inline" />{rating.flagCount}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-500">
                        {formatDate(rating.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {rating.isFeatured ? (
                            <Button variant="ghost" size="sm" onClick={() => executeAction(rating.id, 'unfeature')} icon={<StarIcon size={14} />}>
                              Ondoa
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => executeAction(rating.id, 'feature')} icon={<StarIcon size={14} />}>
                              Angazia
                            </Button>
                          )}
                          {rating.status === 'ARCHIVED' || rating.status === 'REMOVED' ? (
                            <Button variant="ghost" size="sm" onClick={() => executeAction(rating.id, 'activate')} icon={<RotateCcw size={14} />}>
                              Rejesha
                            </Button>
                          ) : (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => openDangerConfirm(rating.id, 'archive', rating.entityName)} icon={<Archive size={14} />}>
                                Hifadhi
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => openDangerConfirm(rating.id, 'remove', rating.entityName)} icon={<Trash2 size={14} />}>
                                Ondoa
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {ratings.map((rating) => (
              <Card key={rating.id} padding="md">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-semibold text-neutral-900 truncate">{rating.entityName}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      {rating.category.icon} {rating.category.name} &middot; {rating.entityType}
                    </p>
                  </div>
                  {statusBadge(rating.status)}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <RatingStars rating={rating.averageRating} />
                  <span className="text-xs text-neutral-500">({formatNumber(rating.totalRatings)} tathmini)</span>
                  {rating.isFeatured && <Badge variant="orange" size="sm">Maarufu</Badge>}
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-neutral-400">{formatDate(rating.createdAt)}</p>
                    <span className="text-xs text-neutral-400">
                      <Eye size={12} className="inline mr-0.5" />{formatNumber(rating.viewCount)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => executeAction(rating.id, rating.isFeatured ? 'unfeature' : 'feature')}
                      icon={<StarIcon size={14} />}
                    />
                    {rating.status === 'ARCHIVED' || rating.status === 'REMOVED' ? (
                      <Button variant="ghost" size="sm" onClick={() => executeAction(rating.id, 'activate')} icon={<RotateCcw size={14} />} />
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => openDangerConfirm(rating.id, 'archive', rating.entityName)} icon={<Archive size={14} />} />
                        <Button variant="danger" size="sm" onClick={() => openDangerConfirm(rating.id, 'remove', rating.entityName)} icon={<Trash2 size={14} />} />
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Ukurasa {pagination.page} kati ya {pagination.totalPages} ({pagination.total} tathmini)
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={pagination.page <= 1} onClick={() => fetchRatings(pagination.page - 1)} icon={<ChevronLeft size={16} />}>
                  Nyuma
                </Button>
                <Button variant="secondary" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchRatings(pagination.page + 1)} icon={<ChevronRight size={16} />}>
                  Mbele
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
