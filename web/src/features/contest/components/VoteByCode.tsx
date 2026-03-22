'use client';

import { useState } from 'react';
import { SendHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getAnonymousId } from '@/lib/utils';

interface VoteByCodeProps {
  contestId: string;
  codePrefix: string;
  onVoteSuccess: (contestantId: string) => void;
  disabled?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export default function VoteByCode({
  contestId,
  codePrefix,
  onVoteSuccess,
  disabled,
}: VoteByCodeProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fullCode = code.toUpperCase().startsWith(codePrefix.toUpperCase())
        ? code.toUpperCase()
        : `${codePrefix}${code}`.toUpperCase();

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      const anonymousId = getAnonymousId();
      if (anonymousId) headers['x-anonymous-id'] = anonymousId;

      const res = await fetch(`${BASE_URL}/api/contests/${contestId}/vote`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Tatizo la seva');
      }

      setSuccess(true);
      onVoteSuccess(data.contestantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tatizo la seva');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-semantic-success/10 border-semantic-success/20">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-semantic-success shrink-0" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">Kura yako imehesabiwa! (Vote recorded!)</p>
            <p className="text-xs text-neutral-700">Asante kwa kushiriki. (Thank you for participating.)</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-bold text-neutral-900 mb-3">
        Piga Kura kwa Nambari (Vote by Code)
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500">
              {codePrefix}
            </span>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder="001"
              disabled={disabled || loading}
              className="w-full h-12 pl-14 pr-4 text-sm font-medium text-neutral-900 bg-neutral-0 border-[1.5px] border-neutral-300 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-neutral-500"
            />
          </div>
          <Button
            type="submit"
            disabled={!code.trim() || disabled}
            loading={loading}
            icon={<SendHorizontal size={18} />}
          >
            Piga Kura (Vote)
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-2 text-xs text-semantic-error">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </Card>
  );
}
