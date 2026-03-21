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
import { getAnonymousId, formatDate } from '@/lib/utils';
import {
  Flag,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Vote,
  Star,
} from 'lucide-react';

interface ReportItem {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  description: string | null;
  status: string;
  priority: number;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resolution: string | null;
  createdAt: string;
  reporter: {
    id: string;
    anonymousId: string;
    username: string | null;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const filterTabs = [
  { id: 'pending', label: 'Zinazosubiri (Pending)' },
  { id: 'reviewing', label: 'Zinakaguliwa (Reviewing)' },
  { id: 'resolved', label: 'Zimetatuliwa (Resolved)' },
  { id: 'dismissed', label: 'Zimeondolewa (Dismissed)' },
  { id: 'all', label: 'Zote (All)' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'PENDING': return <Badge variant="warning">Inasubiri (Pending)</Badge>;
    case 'REVIEWING': return <Badge variant="info">Inakaguliwa (Reviewing)</Badge>;
    case 'RESOLVED': return <Badge variant="success">Imetatuliwa (Resolved)</Badge>;
    case 'DISMISSED': return <Badge variant="default">Imeondolewa (Dismissed)</Badge>;
    default: return <Badge variant="default">{status}</Badge>;
  }
};

const priorityBadge = (priority: number) => {
  if (priority >= 8) return <Badge variant="error">Dharura (Critical)</Badge>;
  if (priority >= 5) return <Badge variant="warning">Kuu (High)</Badge>;
  if (priority >= 3) return <Badge variant="info">Wastani (Medium)</Badge>;
  return <Badge variant="default">Chini (Low)</Badge>;
};

const targetTypeIcon = (type: string) => {
  switch (type) {
    case 'vote': return <Vote size={14} className="text-semantic-info" />;
    case 'rating': return <Star size={14} className="text-amber-500" />;
    case 'user': return <User size={14} className="text-purple-500" />;
    default: return <Flag size={14} className="text-neutral-400" />;
  }
};

const targetTypeLabel = (type: string) => {
  switch (type) {
    case 'vote': return 'Kura (Vote)';
    case 'rating': return 'Tathmini (Rating)';
    case 'user': return 'Mtumiaji (User)';
    default: return type;
  }
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{ reportId: string; action: string }>({ reportId: '', action: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });

  const fetchReports = useCallback(async (page = 1) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        status: filter,
      });
      const res = await fetch(`/api/admin/reports?${params}`, {
        headers: { 'x-anonymous-id': getAnonymousId() },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setReports(data.reports);
      setPagination(data.pagination);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const executeAction = async (reportId: string, action: string, reason?: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({ reportId, action, reason }),
      });
      if (!res.ok) throw new Error('Failed');

      const actionLabels: Record<string, string> = {
        resolve: 'imetatuliwa (resolved)',
        dismiss: 'imeondolewa (dismissed)',
        reviewing: 'inakaguliwa (under review)',
        ban_user: 'mtumiaji amezuiwa (user banned)',
        remove_content: 'maudhui yameondolewa (content removed)',
      };

      setToast({
        message: `Ripoti ${actionLabels[action] || 'imebadilishwa'}`,
        type: 'success',
        visible: true,
      });
      fetchReports(pagination.page);
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena.', type: 'error', visible: true });
    }
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    await executeAction(confirmData.reportId, confirmData.action);
    setActionLoading(false);
    setConfirmOpen(false);
  };

  const openDangerConfirm = (reportId: string, action: string) => {
    setConfirmData({ reportId, action });
    setConfirmOpen(true);
  };

  const getConfirmTitle = () => {
    switch (confirmData.action) {
      case 'ban_user': return 'Zuia Mtumiaji (Ban User)';
      case 'remove_content': return 'Ondoa Maudhui (Remove Content)';
      default: return 'Thibitisha Kitendo (Confirm Action)';
    }
  };

  const getConfirmMessage = () => {
    switch (confirmData.action) {
      case 'ban_user':
        return 'Una uhakika unataka kumzuia mtumiaji aliyeripotiwa? Hataweza kutumia jukwaa tena. (Are you sure you want to ban the reported user?)';
      case 'remove_content':
        return 'Una uhakika unataka kuondoa maudhui yaliyoripotiwa? (Are you sure you want to remove the reported content?)';
      default:
        return 'Thibitisha kitendo hiki (Confirm this action)';
    }
  };

  if (error) return <ErrorState onRetry={() => fetchReports(1)} />;

  return (
    <div className="space-y-4">
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={getConfirmTitle()}
        message={getConfirmMessage()}
        confirmLabel={confirmData.action === 'ban_user' ? 'Zuia (Ban)' : 'Ondoa (Remove)'}
        variant="danger"
        loading={actionLoading}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Ripoti na Udhibiti (Reports & Moderation)</h1>
        <p className="text-sm text-neutral-500 mt-1">Simamia ripoti za maudhui na watumiaji (Manage content and user reports)</p>
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
                  <Skeleton variant="rectangular" className="w-20 h-5" />
                  <Skeleton variant="rectangular" className="w-16 h-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={<Flag size={32} />}
          title="Hakuna ripoti (No reports found)"
          description={filter === 'pending'
            ? 'Hakuna ripoti zinazosubiri! Umefanya kazi nzuri. (No pending reports! Great work.)'
            : 'Hakuna ripoti zinazolingana na chujio lako (No reports match your filter)'
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <Card padding="sm" className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Ripoti (Report)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Aina (Type)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Sababu (Reason)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Kipaumbele (Priority)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Hali (Status)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Tarehe (Date)</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Vitendo (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-xs text-neutral-400">
                            Imeripotiwa na: {report.reporter.username || report.reporter.anonymousId.slice(0, 8) + '...'}
                          </p>
                          <p className="text-xs text-neutral-400 font-mono mt-0.5">
                            Lengo: {report.targetId.slice(0, 12)}...
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {targetTypeIcon(report.targetType)}
                          <span className="text-xs text-neutral-600">{targetTypeLabel(report.targetType)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-neutral-900 font-medium">{report.reason}</p>
                          {report.description && (
                            <p className="text-xs text-neutral-500 mt-0.5 truncate">{report.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {priorityBadge(report.priority)}
                      </td>
                      <td className="py-3 px-4">
                        {statusBadge(report.status)}
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-500">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {report.status === 'PENDING' || report.status === 'REVIEWING' ? (
                          <div className="flex items-center justify-end gap-1">
                            {report.status === 'PENDING' && (
                              <Button variant="ghost" size="sm" onClick={() => executeAction(report.id, 'reviewing')} icon={<Eye size={14} />}>
                                Kagua
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => executeAction(report.id, 'resolve')} icon={<CheckCircle size={14} />}>
                              Tatua
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => executeAction(report.id, 'dismiss')} icon={<XCircle size={14} />}>
                              Ondoa
                            </Button>
                            {report.targetType === 'user' && (
                              <Button variant="danger" size="sm" onClick={() => openDangerConfirm(report.id, 'ban_user')} icon={<Ban size={14} />}>
                                Zuia
                              </Button>
                            )}
                            {(report.targetType === 'vote' || report.targetType === 'rating') && (
                              <Button variant="danger" size="sm" onClick={() => openDangerConfirm(report.id, 'remove_content')} icon={<Trash2 size={14} />}>
                                Ondoa
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">{report.resolution || '-'}</p>
                            {report.reviewedAt && (
                              <p className="text-[11px] text-neutral-400 mt-0.5">{formatDate(report.reviewedAt)}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {reports.map((report) => (
              <Card key={report.id} padding="md">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {targetTypeIcon(report.targetType)}
                    <span className="text-xs font-medium text-neutral-600">{targetTypeLabel(report.targetType)}</span>
                  </div>
                  <div className="flex gap-1">
                    {priorityBadge(report.priority)}
                    {statusBadge(report.status)}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-semibold text-neutral-900">{report.reason}</p>
                  {report.description && (
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{report.description}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    Imeripotiwa na: {report.reporter.username || report.reporter.anonymousId.slice(0, 8) + '...'}
                  </p>
                </div>

                {report.status === 'PENDING' || report.status === 'REVIEWING' ? (
                  <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-3">
                    {report.status === 'PENDING' && (
                      <Button variant="ghost" size="sm" onClick={() => executeAction(report.id, 'reviewing')} icon={<Eye size={14} />}>
                        Kagua (Review)
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => executeAction(report.id, 'resolve')} icon={<CheckCircle size={14} />}>
                      Tatua (Resolve)
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => executeAction(report.id, 'dismiss')} icon={<XCircle size={14} />}>
                      Ondoa (Dismiss)
                    </Button>
                    {report.targetType === 'user' && (
                      <Button variant="danger" size="sm" onClick={() => openDangerConfirm(report.id, 'ban_user')} icon={<Ban size={14} />}>
                        Zuia Mtumiaji (Ban)
                      </Button>
                    )}
                    {(report.targetType === 'vote' || report.targetType === 'rating') && (
                      <Button variant="danger" size="sm" onClick={() => openDangerConfirm(report.id, 'remove_content')} icon={<Trash2 size={14} />}>
                        Ondoa Maudhui (Remove)
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-neutral-100 pt-2">
                    <p className="text-xs text-neutral-500">{report.resolution || '-'}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{formatDate(report.createdAt)}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Ukurasa {pagination.page} kati ya {pagination.totalPages} ({pagination.total} ripoti)
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={pagination.page <= 1} onClick={() => fetchReports(pagination.page - 1)} icon={<ChevronLeft size={16} />}>
                  Nyuma
                </Button>
                <Button variant="secondary" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchReports(pagination.page + 1)} icon={<ChevronRight size={16} />}>
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
