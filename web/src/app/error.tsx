'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Mkadamnasi Error]', { message: error.message, digest: error.digest, stack: error.stack });
  }, [error]);

  const errorRef = error.digest || `MKD-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-neutral-100">
      {/* Professional error illustration */}
      <div className="mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="56" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="60" cy="60" r="40" fill="#FEF2F2" />
          <path d="M60 35L82 75H38L60 35Z" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="60" y1="50" x2="60" y2="62" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="68" r="1.5" fill="#EF4444" />
        </svg>
      </div>

      <p className="text-xs font-semibold text-brand-primary tracking-widest uppercase mb-3">Mkadamnasi</p>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        Samahani, hitilafu imetokea
      </h1>
      <p className="text-sm text-neutral-500 mb-2 max-w-md">
        Tunajua kuhusu tatizo hili na tunafanya kazi kulitatua. Tafadhali jaribu tena au rudi baadaye.
      </p>
      <p className="text-xs text-neutral-400 mb-1">
        Something went wrong. We&apos;re working on fixing it.
      </p>

      <div className="flex gap-3 mt-6">
        <Button onClick={reset}>Jaribu Tena</Button>
        <Button variant="secondary" onClick={() => window.location.href = '/'}>
          Rudi Nyumbani
        </Button>
      </div>

      <p className="text-xs text-neutral-300 mt-8 font-mono">
        Ref: {errorRef}
      </p>
    </div>
  );
}
