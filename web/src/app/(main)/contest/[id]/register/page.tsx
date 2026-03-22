'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserPlus, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { getAnonymousId } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

interface ContestInfo {
  id: string;
  title: string;
  registrationOpen: boolean;
  codePrefix: string;
}

export default function ContestRegisterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<ContestInfo | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [metadata, setMetadata] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [assignedCode, setAssignedCode] = useState<string | null>(null);

  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const anonymousId = getAnonymousId();
    if (anonymousId) headers['x-anonymous-id'] = anonymousId;
    return headers;
  }, []);

  useEffect(() => {
    async function fetchContest() {
      try {
        const res = await fetch(`${BASE_URL}/api/contests/${id}`, { headers: getHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Tatizo la seva');
        setContest({
          id: data.data.id,
          title: data.data.title,
          registrationOpen: data.data.registrationOpen,
          codePrefix: data.data.codePrefix,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Tatizo la seva');
      } finally {
        setPageLoading(false);
      }
    }
    if (id) fetchContest();
  }, [id, getHeaders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const body: Record<string, string> = {
        fullName: fullName.trim(),
      };
      if (bio.trim()) body.bio = bio.trim();
      if (photoUrl.trim()) body.photoUrl = photoUrl.trim();
      if (metadata.trim()) body.metadata = metadata.trim();

      const res = await fetch(`${BASE_URL}/api/contests/${id}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tatizo la seva');

      setAssignedCode(data.code || data.data?.code);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Tatizo la seva');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Usajili" showBack />
        <div className="px-4 lg:px-6 py-4 space-y-4">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Usajili" showBack />
        <div className="px-4 lg:px-6 py-12 text-center">
          <p className="text-neutral-700">{error || 'Mashindano hayakupatikana. (Contest not found.)'}</p>
        </div>
      </div>
    );
  }

  if (!contest.registrationOpen) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Usajili" showBack />
        <div className="px-4 lg:px-6 py-4 space-y-4">
          <Card className="bg-red-50 border-semantic-error/20">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-semantic-error shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Usajili umefungwa (Registration closed)</p>
                <p className="text-xs text-neutral-700">Usajili wa washiriki kwa mashindano haya umefungwa. (Registration for this contest is closed.)</p>
              </div>
            </div>
          </Card>
          <Button variant="secondary" className="w-full" onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-1" />
            Rudi Nyuma (Go Back)
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (assignedCode) {
    return (
      <div className="max-w-2xl mx-auto">
        <TopBar title="Usajili" showBack />
        <div className="px-4 lg:px-6 py-4 space-y-4">
          <Card className="bg-semantic-success/10 border-semantic-success/20">
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-semantic-success mx-auto mb-3" />
              <h2 className="text-lg font-bold text-neutral-900 mb-1">Umesajiliwa! (Registered!)</h2>
              <p className="text-sm text-neutral-700 mb-4">Usajili wako umekamilika. Hii ni nambari yako ya kushiriki: (Your registration is complete. This is your participation code:)</p>
              <div className="bg-neutral-0 rounded-2xl border-2 border-brand-primary p-6 inline-block mx-auto">
                <p className="text-3xl sm:text-4xl font-bold text-brand-primary tracking-wider">{assignedCode}</p>
              </div>
              <p className="text-xs text-neutral-500 mt-4">Hifadhi nambari hii. Wapiga kura wataitumia kupiga kura kwako. (Save this code. Voters will use it to vote for you.)</p>
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={() => router.push(`/contest/${id}`)}
          >
            Tazama Mashindano (View Contest)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Usajili" showBack />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
            <UserPlus size={20} className="text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Usajili wa Washiriki (Registration)</h1>
            <p className="text-neutral-700 text-sm">{contest.title}</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {/* Mobile header */}
        <div className="lg:hidden">
          <h1 className="text-xl font-bold text-neutral-900 mb-1">Usajili wa Washiriki (Registration)</h1>
          <p className="text-sm text-neutral-700">{contest.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                  Jina Kamili (Full Name) <span className="text-semantic-error">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Andika jina lako kamili (Enter your full name)"
                  required
                  className="w-full h-12 px-4 text-sm text-neutral-900 bg-neutral-0 border-[1.5px] border-neutral-300 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors placeholder:text-neutral-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                  Maelezo Mafupi (Short Bio)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Andika maelezo mafupi kukuhusu (Write a short description about yourself)"
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-neutral-900 bg-neutral-0 border-[1.5px] border-neutral-300 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors placeholder:text-neutral-500 resize-none"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                  Picha (Photo URL)
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/picha.jpg"
                  className="w-full h-12 px-4 text-sm text-neutral-900 bg-neutral-0 border-[1.5px] border-neutral-300 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors placeholder:text-neutral-500"
                />
              </div>

              {/* Optional Metadata */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                  Taarifa Nyingine (Additional Info)
                </label>
                <input
                  type="text"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder="Mfano: Shule, Mkoa, n.k. (e.g., School, Region, etc.)"
                  className="w-full h-12 px-4 text-sm text-neutral-900 bg-neutral-0 border-[1.5px] border-neutral-300 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors placeholder:text-neutral-500"
                />
              </div>
            </div>
          </Card>

          {submitError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl">
              <AlertCircle size={16} className="text-semantic-error shrink-0" />
              <p className="text-xs text-semantic-error font-medium">{submitError}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!fullName.trim()}
            loading={submitting}
            icon={<UserPlus size={18} />}
          >
            Jiandikishe (Register)
          </Button>
        </form>
      </div>
    </div>
  );
}
