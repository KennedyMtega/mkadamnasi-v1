'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, AlertCircle, Info, RefreshCw, ChevronDown, ChevronUp, Search, Filter, Bug, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { getAnonymousId } from '@/lib/utils';

interface SystemLog {
  id: string;
  level: string;
  source: string;
  message: string;
  stack: string | null;
  metadata: Record<string, unknown> | null;
  userId: string | null;
  requestId: string | null;
  duration: number | null;
  statusCode: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface LogSummary {
  errors24h: number;
  warnings24h: number;
  totalLogs: number;
}

const levelConfig: Record<string, { icon: React.ElementType; color: string; badgeVariant: string; label: string }> = {
  error: { icon: AlertCircle, color: 'text-semantic-error', badgeVariant: 'error', label: 'Hitilafu' },
  warn: { icon: AlertTriangle, color: 'text-amber-500', badgeVariant: 'warning', label: 'Onyo' },
  info: { icon: Info, color: 'text-semantic-info', badgeVariant: 'info', label: 'Taarifa' },
  debug: { icon: Bug, color: 'text-neutral-400', badgeVariant: 'default', label: 'Debug' },
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [summary, setSummary] = useState<LogSummary>({ errors24h: 0, warnings24h: 0, totalLogs: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [levelFilter, setLevelFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const limit = 50;

  const fetchLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (levelFilter !== 'all') params.set('level', levelFilter);
      if (sourceFilter) params.set('source', sourceFilter);
      if (searchQuery) params.set('search', searchQuery);
      params.set('limit', String(limit));
      params.set('offset', String(page * limit));

      const res = await fetch(`/api/admin/logs?${params}`, {
        headers: { 'x-anonymous-id': getAnonymousId() },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLogs(data.data);
      setTotal(data.total);
      setSummary(data.summary);
    } catch {
      // Silently fail - page will show empty state
    } finally {
      setLoading(false);
    }
  }, [levelFilter, sourceFilter, searchQuery, page]);

  useEffect(() => {
    setLoading(true);
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('sw-TZ', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kumbukumbu za Mfumo</h1>
          <p className="text-sm text-neutral-500 mt-1">System Logs - Fuatilia hitilafu, maonyo, na matukio yote</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${autoRefresh ? 'bg-semantic-success/10 text-semantic-success' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
          >
            <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'Hai (Live)' : 'Auto-refresh'}
          </button>
          <Button size="sm" variant="secondary" onClick={() => { setLoading(true); fetchLogs(); }}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-semantic-error/10 flex items-center justify-center">
              <AlertCircle size={20} className="text-semantic-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{summary.errors24h}</p>
              <p className="text-xs text-neutral-500">Hitilafu (24h)</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{summary.warnings24h}</p>
              <p className="text-xs text-neutral-500">Maonyo (24h)</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-semantic-info/10 flex items-center justify-center">
              <Info size={20} className="text-semantic-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{summary.totalLogs.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">Jumla Logs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Filter size={16} />
            <span>Chuja:</span>
          </div>
          <select
            value={levelFilter}
            onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }}
            className="h-10 rounded-xl border border-neutral-300 bg-neutral-0 px-3 text-sm focus:outline-none focus:border-brand-primary"
          >
            <option value="all">Ngazi Zote</option>
            <option value="error">Hitilafu (Error)</option>
            <option value="warn">Onyo (Warn)</option>
            <option value="info">Taarifa (Info)</option>
          </select>
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Tafuta ujumbe..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-300 bg-neutral-0 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Chanzo (Source)..."
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(0); }}
            className="h-10 w-48 rounded-xl border border-neutral-300 bg-neutral-0 px-3 text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden !p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Info size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500">Hakuna kumbukumbu zinazopatikana</p>
            <p className="text-xs text-neutral-400 mt-1">No logs found matching your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[100px_70px_140px_1fr_80px_60px] gap-3 px-4 py-2.5 bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <span>Muda</span>
              <span>Ngazi</span>
              <span>Chanzo</span>
              <span>Ujumbe</span>
              <span>Mtumiaji</span>
              <span>Hali</span>
            </div>

            {logs.map((log) => {
              const config = levelConfig[log.level] || levelConfig.info;
              const Icon = config.icon;
              const isExpanded = expandedId === log.id;

              return (
                <div key={log.id}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="w-full text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[100px_70px_140px_1fr_80px_60px] gap-2 sm:gap-3 px-4 py-3 items-center">
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock size={12} className="sm:hidden" />
                        {formatTime(log.createdAt)}
                      </span>
                      <span>
                        <Badge variant={config.badgeVariant as 'error' | 'warning' | 'info' | 'success' | 'orange'}>
                          <Icon size={12} className="mr-1" />
                          {log.level}
                        </Badge>
                      </span>
                      <span className="text-xs text-neutral-600 font-mono truncate">{log.source}</span>
                      <span className="text-sm text-neutral-900 truncate">{log.message}</span>
                      <span className="text-xs text-neutral-400 truncate">{log.userId?.slice(0, 8) || '-'}</span>
                      <div className="flex items-center gap-1">
                        {log.statusCode && (
                          <span className={`text-xs font-mono ${log.statusCode >= 500 ? 'text-semantic-error' : log.statusCode >= 400 ? 'text-amber-500' : 'text-semantic-success'}`}>
                            {log.statusCode}
                          </span>
                        )}
                        {isExpanded ? <ChevronUp size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-neutral-400 block">Request ID</span>
                          <span className="text-neutral-700 font-mono break-all">{log.requestId || '-'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">IP Address</span>
                          <span className="text-neutral-700 font-mono">{log.ipAddress || '-'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">Duration</span>
                          <span className="text-neutral-700">{log.duration ? `${log.duration}ms` : '-'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block">User Agent</span>
                          <span className="text-neutral-700 truncate block">{log.userAgent?.slice(0, 60) || '-'}</span>
                        </div>
                      </div>

                      {log.stack && (
                        <div>
                          <span className="text-xs text-neutral-400 block mb-1">Stack Trace</span>
                          <pre className="text-xs text-semantic-error bg-neutral-900 text-neutral-100 p-3 rounded-lg overflow-x-auto max-h-48 font-mono">
                            {log.stack}
                          </pre>
                        </div>
                      )}

                      {log.metadata && (
                        <div>
                          <span className="text-xs text-neutral-400 block mb-1">Metadata</span>
                          <pre className="text-xs bg-neutral-100 p-3 rounded-lg overflow-x-auto max-h-32 font-mono text-neutral-700">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Kuonyesha {page * limit + 1}-{Math.min((page + 1) * limit, total)} kati ya {total.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Nyuma
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Mbele
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
