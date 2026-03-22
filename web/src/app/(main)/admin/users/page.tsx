'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import SearchInput from '@/components/ui/SearchInput';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import { getAnonymousId, formatDate } from '@/lib/utils';
import {
  Users,
  Ban,
  ShieldCheck,
  Crown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface UserItem {
  id: string;
  anonymousId: string;
  username: string | null;
  email: string | null;
  points: number;
  level: number;
  isPremium: boolean;
  isBanned: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  banReason: string | null;
  region: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  _count: {
    voteEntries: number;
    ratingEntries: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const filterTabs = [
  { id: 'all', label: 'Wote (All)' },
  { id: 'premium', label: 'Premium' },
  { id: 'banned', label: 'Waliozuiwa (Banned)' },
  { id: 'verified', label: 'Waliothibitishwa (Verified)' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ userId: string; action: string; username: string }>({ userId: '', action: '', username: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        filter,
        ...(searchDebounced && { search: searchDebounced }),
      });
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { 'x-anonymous-id': getAnonymousId() },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filter, searchDebounced]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleAction = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({
          userId: confirmAction.userId,
          action: confirmAction.action,
        }),
      });
      if (!res.ok) throw new Error('Failed');

      const actionLabels: Record<string, string> = {
        ban: 'amezuiwa (banned)',
        unban: 'ameruhusiwa (unbanned)',
      };

      setToast({
        message: `Mtumiaji ${confirmAction.username || 'Asiyejulikana'} ${actionLabels[confirmAction.action] || 'amebadilishwa'}`,
        type: 'success',
        visible: true,
      });
      setConfirmOpen(false);
      fetchUsers(pagination.page);
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena. (Error occurred)', type: 'error', visible: true });
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirm = (userId: string, action: string, username: string) => {
    setConfirmAction({ userId, action, username });
    setConfirmOpen(true);
  };

  const getConfirmMessage = () => {
    if (confirmAction.action === 'ban') {
      return `Una uhakika unataka kumzuia "${confirmAction.username || 'Asiyejulikana'}"? Hataeza kuendelea kutumia jukwaa. (Are you sure you want to ban this user?)`;
    }
    return `Una uhakika unataka kumruhusu "${confirmAction.username || 'Asiyejulikana'}" tena? (Are you sure you want to unban this user?)`;
  };

  if (error) {
    return <ErrorState onRetry={() => fetchUsers(1)} />;
  }

  return (
    <div className="space-y-4">
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleAction}
        title={confirmAction.action === 'ban' ? 'Zuia Mtumiaji (Ban User)' : 'Ruhusu Mtumiaji (Unban User)'}
        message={getConfirmMessage()}
        confirmLabel={confirmAction.action === 'ban' ? 'Zuia (Ban)' : 'Ruhusu (Unban)'}
        variant={confirmAction.action === 'ban' ? 'danger' : 'default'}
        loading={actionLoading}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Watumiaji (Users)</h1>
        <p className="text-sm text-neutral-500 mt-1">Simamia watumiaji wa jukwaa (Manage platform users)</p>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Tafuta kwa jina, email, au ID... (Search by name, email, or ID...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />

      {/* Filters */}
      <Tabs tabs={filterTabs} activeTab={filter} onChange={(id) => setFilter(id)} />

      {/* Users list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-32 h-4" />
                  <Skeleton variant="text" className="w-48 h-3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="Hakuna watumiaji (No users found)"
          description="Hakuna watumiaji wanaolingana na utafutaji wako (No users match your search)"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <Card padding="sm" className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Mtumiaji (User)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Pointi (Points)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Kiwango (Level)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Shughuli (Activity)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Hali (Status)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Tarehe (Date)</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Vitendo (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-neutral-900">
                            {user.username || 'Asiyejulikana (Anonymous)'}
                          </p>
                          <p className="text-xs text-neutral-400 font-mono">
                            {user.anonymousId.slice(0, 12)}...
                          </p>
                          {user.email && (
                            <p className="text-xs text-neutral-500">{user.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-900">{user.points}</td>
                      <td className="py-3 px-4 font-medium text-neutral-900">Lv. {user.level}</td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-neutral-500">
                          Kura: {user._count.voteEntries} | Tathmini: {user._count.ratingEntries}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.isPremium && <Badge variant="orange">Premium</Badge>}
                          {user.isVerified && <Badge variant="success">Verified</Badge>}
                          {user.isAdmin && <Badge variant="info">Admin</Badge>}
                          {user.isBanned && <Badge variant="error">Banned</Badge>}
                          {!user.isPremium && !user.isVerified && !user.isBanned && !user.isAdmin && (
                            <Badge variant="default">Kawaida (Normal)</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!user.isAdmin && (
                          user.isBanned ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openConfirm(user.id, 'unban', user.username || user.anonymousId.slice(0, 8))}
                              icon={<ShieldCheck size={14} />}
                            >
                              Ruhusu
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openConfirm(user.id, 'ban', user.username || user.anonymousId.slice(0, 8))}
                              icon={<Ban size={14} />}
                            >
                              Zuia
                            </Button>
                          )
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
            {users.map((user) => (
              <Card key={user.id} padding="md">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {user.username || 'Asiyejulikana (Anonymous)'}
                    </p>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      {user.anonymousId.slice(0, 12)}...
                    </p>
                    {user.email && (
                      <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {user.isPremium && <Badge variant="orange" size="sm">Premium</Badge>}
                    {user.isVerified && <Badge variant="success" size="sm">Verified</Badge>}
                    {user.isAdmin && <Badge variant="info" size="sm">Admin</Badge>}
                    {user.isBanned && <Badge variant="error" size="sm">Banned</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
                  <div className="text-center bg-neutral-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-neutral-900">{user.points}</p>
                    <p className="text-[10px] text-neutral-500">Pointi</p>
                  </div>
                  <div className="text-center bg-neutral-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-neutral-900">Lv.{user.level}</p>
                    <p className="text-[10px] text-neutral-500">Kiwango</p>
                  </div>
                  <div className="text-center bg-neutral-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-neutral-900">{user._count.voteEntries + user._count.ratingEntries}</p>
                    <p className="text-[10px] text-neutral-500">Shughuli</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500">{formatDate(user.createdAt)}</p>
                  {!user.isAdmin && (
                    user.isBanned ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openConfirm(user.id, 'unban', user.username || user.anonymousId.slice(0, 8))}
                        icon={<ShieldCheck size={14} />}
                      >
                        Ruhusu (Unban)
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openConfirm(user.id, 'ban', user.username || user.anonymousId.slice(0, 8))}
                        icon={<Ban size={14} />}
                      >
                        Zuia (Ban)
                      </Button>
                    )
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Ukurasa {pagination.page} kati ya {pagination.totalPages} ({pagination.total} watumiaji)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                  icon={<ChevronLeft size={16} />}
                >
                  Nyuma
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                  icon={<ChevronRight size={16} />}
                >
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
