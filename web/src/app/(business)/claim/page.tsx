'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import {
  Search,
  Building2,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  MapPin,
  Star,
} from 'lucide-react';

interface BusinessResult {
  id: string;
  name: string;
  categorySlug: string;
  region: string | null;
  isClaimed: boolean;
  averageRating: number;
}

interface ClaimRequest {
  id: string;
  businessName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  notes: string | null;
}

const claimStatusConfig = {
  PENDING: { label: 'Inasubiri (Pending)', color: 'bg-semantic-warning/10 text-semantic-warning', icon: Clock },
  APPROVED: { label: 'Imekubaliwa (Approved)', color: 'bg-semantic-success/10 text-semantic-success', icon: CheckCircle },
  REJECTED: { label: 'Imekataliwa (Rejected)', color: 'bg-semantic-error/10 text-semantic-error', icon: XCircle },
};

export default function BusinessClaimPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [myClaims, setMyClaims] = useState<ClaimRequest[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessResult | null>(null);
  const [claimNotes, setClaimNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch('/api/business/claim');
        if (res.ok) {
          const data = await res.json();
          setMyClaims(data.claims || []);
        }
      } catch {
        // placeholder
      } finally {
        setLoadingClaims(false);
      }
    }
    fetchClaims();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/business/claim?search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.businesses || []);
      }
    } catch {
      // empty
    } finally {
      setSearching(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedBusiness) return;
    setSubmitting(true);
    setSuccess('');
    try {
      const res = await fetch('/api/business/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBusiness.id,
          notes: claimNotes,
        }),
      });
      if (res.ok) {
        setSuccess('Ombi lako limetumwa! Tutakujibu hivi karibuni. (Your claim has been submitted!)');
        setSelectedBusiness(null);
        setClaimNotes('');
        setSearchResults([]);
        setSearchQuery('');
        // Refetch claims
        const claimsRes = await fetch('/api/business/claim');
        if (claimsRes.ok) {
          const data = await claimsRes.json();
          setMyClaims(data.claims || []);
        }
      }
    } catch {
      // error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dai Biashara (Claim Business)</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Tafuta na udai biashara yako kwenye Mkadamnasi. Find and claim your business on Mkadamnasi.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-semantic-success/10 border border-semantic-success/20 text-semantic-success text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Search */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Tafuta Biashara (Search for Business)
        </h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ingiza jina la biashara... (Enter business name...)"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-5 h-12 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors disabled:opacity-50"
          >
            {searching ? (
              <div className="w-5 h-5 border-2 border-neutral-0 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Tafuta (Search)'
            )}
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-neutral-700">Matokeo ({searchResults.length})</p>
            {searchResults.map((biz) => (
              <div
                key={biz.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedBusiness?.id === biz.id
                    ? 'border-brand-primary bg-brand-primary-light'
                    : 'border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light/50'
                }`}
                onClick={() => !biz.isClaimed && setSelectedBusiness(biz)}
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">{biz.name}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                    {biz.region && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {biz.region}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-semantic-warning" /> {biz.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                {biz.isClaimed ? (
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                    Imedaiwa (Claimed)
                  </span>
                ) : (
                  <ArrowRight size={16} className="text-brand-primary" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Claim form */}
        {selectedBusiness && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-100 border border-neutral-300 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-brand-primary" />
              <p className="text-sm font-semibold text-neutral-900">
                Unadai: {selectedBusiness.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Maelezo ya Ziada (Additional Notes)
              </label>
              <textarea
                value={claimNotes}
                onChange={(e) => setClaimNotes(e.target.value)}
                placeholder="Eleza uhusiano wako na biashara hii... (Explain your relationship with this business...)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <Upload size={14} className="inline mr-1" />
                Hati ya Uthibitisho (Verification Document)
              </label>
              <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-0 cursor-pointer hover:border-brand-primary transition-colors">
                <div className="text-center">
                  <FileText size={24} className="text-neutral-400 mx-auto mb-1" />
                  <p className="text-xs text-neutral-500">Bonyeza kupakia hati (Click to upload document)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBusiness(null)}
                className="flex-1 h-11 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-sm hover:bg-neutral-100 transition-colors"
              >
                Ghairi (Cancel)
              </button>
              <button
                onClick={handleClaim}
                disabled={submitting}
                className="flex-1 h-11 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-neutral-0 border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Tuma Ombi (Submit Claim)'
                )}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* My claims */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Maombi Yangu (My Claims)
        </h2>
        {loadingClaims ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : myClaims.length > 0 ? (
          <div className="space-y-3">
            {myClaims.map((claim) => {
              const config = claimStatusConfig[claim.status];
              const StatusIcon = config.icon;
              return (
                <div key={claim.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-100 border border-neutral-300">
                  <div className="w-10 h-10 rounded-xl bg-neutral-0 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{claim.businessName}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(claim.createdAt).toLocaleDateString('sw-TZ')}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${config.color}`}>
                    <StatusIcon size={12} />
                    {config.label}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 size={32} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">Hakuna maombi bado (No claims yet)</p>
          </div>
        )}
      </Card>
    </div>
  );
}
