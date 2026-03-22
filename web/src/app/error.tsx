'use client';

import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-neutral-100">
      <div className="w-20 h-20 rounded-full bg-semantic-error/10 flex items-center justify-center mb-6">
        <span className="text-4xl">😔</span>
      </div>
      <h1 className="text-xl font-bold text-neutral-900 mb-2">
        Hitilafu imetokea
      </h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-sm">
        {error.message || 'Kuna tatizo la kiufundi. Tafadhali jaribu tena.'}
      </p>
      <Button onClick={reset}>Jaribu Tena</Button>
    </div>
  );
}
