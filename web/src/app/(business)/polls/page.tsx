'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import {
  PlusCircle,
  Vote,
  Users,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Eye,
  BarChart3,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description: string;
  totalVotes: number;
  status: 'ACTIVE' | 'ENDED' | 'DRAFT';
  endDate: string | null;
  createdAt: string;
  optionCount: number;
}

const statusConfig = {
  ACTIVE: { label: 'Hai (Active)', color: 'bg-semantic-success/10 text-semantic-success', icon: CheckCircle },
  ENDED: { label: 'Imekwisha (Ended)', color: 'bg-neutral-300/50 text-neutral-600', icon: XCircle },
  DRAFT: { label: 'Rasimu (Draft)', color: 'bg-semantic-warning/10 text-semantic-warning', icon: FileText },
};

export default function BusinessPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'ENDED' | 'DRAFT'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchPolls() {
      try {
        const res = await fetch('/api/business/polls');
        if (res.ok) {
          const data = await res.json();
          setPolls(data.polls || []);
        }
      } catch {
        // Use empty
      } finally {
        setLoading(false);
      }
    }
    fetchPolls();
  }, []);

  const filteredPolls = polls.filter((p) => {
    if (filter !== 'ALL' && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kura Zangu (My Polls)</h1>
          <p className="text-sm text-neutral-500 mt-1">Simamia kura zako zote hapa. Manage all your polls here.</p>
        </div>
        <Link
          href="/business/polls/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand"
        >
          <PlusCircle size={18} />
          Unda Kura Mpya (Create Poll)
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta kura... (Search polls...)"
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'ACTIVE', 'ENDED', 'DRAFT'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-brand-primary text-neutral-0'
                  : 'bg-neutral-0 text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              {f === 'ALL' ? 'Zote (All)' : statusConfig[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Polls list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-neutral-100 rounded" />
                  <div className="h-4 w-1/2 bg-neutral-100 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredPolls.length > 0 ? (
        <div className="space-y-3">
          {filteredPolls.map((poll) => {
            const config = statusConfig[poll.status];
            const StatusIcon = config.icon;
            return (
              <Card key={poll.id} padding="md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary-light flex items-center justify-center shrink-0">
                    <Vote size={22} className="text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900">{poll.title}</h3>
                        {poll.description && (
                          <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">{poll.description}</p>
                        )}
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${config.color}`}>
                        <StatusIcon size={12} />
                        {config.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {poll.totalVotes} kura (votes)
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        {poll.optionCount} chaguo (options)
                      </span>
                      {poll.endDate && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Inaisha: {new Date(poll.endDate).toLocaleDateString('sw-TZ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/business/polls/${poll.id}`}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                  >
                    <Eye size={18} className="text-neutral-500" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="lg">
          <div className="text-center py-12">
            <Vote size={48} className="text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {search || filter !== 'ALL' ? 'Hakuna matokeo (No results)' : 'Hakuna kura bado (No polls yet)'}
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              {search || filter !== 'ALL'
                ? 'Jaribu kubadilisha utafutaji au filter. Try changing your search or filter.'
                : 'Unda kura yako ya kwanza ili kupata maoni ya wateja. Create your first poll to get customer feedback.'}
            </p>
            {!search && filter === 'ALL' && (
              <Link
                href="/business/polls/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand"
              >
                <PlusCircle size={18} />
                Unda Kura ya Kwanza (Create First Poll)
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
