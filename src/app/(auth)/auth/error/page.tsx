'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const errorMessages: Record<string, string> = {
  Configuration: 'Hitilafu ya usanidi wa mfumo. Tafadhali jaribu tena baadaye.',
  AccessDenied: 'Huna ruhusa ya kufikia ukurasa huu.',
  Verification: 'Kiungo cha uthibitishaji kimekwisha muda au kimetumika tayari.',
  CredentialsSignin: 'Barua pepe/nambari ya simu au nywila si sahihi.',
  SessionRequired: 'Tafadhali ingia kwanza ili kufikia ukurasa huu.',
  Default: 'Hitilafu imetokea wakati wa kuingia. Tafadhali jaribu tena.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'Default';
  const message = errorMessages[errorType] || errorMessages.Default;

  return (
    <div className="text-center">
      {/* Error icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
        <AlertCircle size={32} className="text-semantic-error" />
      </div>

      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        Hitilafu! (Error)
      </h1>
      <p className="text-neutral-600 text-sm mb-6">
        Samahani, tatizo limetokea
      </p>

      <Card className="mb-8 text-left">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-semantic-error shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-neutral-900 mb-1">
              {errorType !== 'Default' && (
                <span className="text-xs text-neutral-500 font-normal block mb-1">
                  Aina: {errorType}
                </span>
              )}
              {message}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={() => window.location.reload()}
          className="w-full"
          size="lg"
          icon={<RefreshCw size={20} />}
        >
          Jaribu Tena (Retry)
        </Button>

        <Link href="/auth/login" className="block">
          <Button
            variant="ghost"
            className="w-full"
            size="lg"
            icon={<ArrowLeft size={20} />}
          >
            Rudi kwenye Kuingia (Back to Login)
          </Button>
        </Link>

        <Link href="/" className="block">
          <Button
            variant="ghost"
            className="w-full"
            size="md"
          >
            Rudi Nyumbani (Go Home)
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ErrorPageSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <div className="w-16 h-16 rounded-full bg-neutral-200 mx-auto mb-6" />
      <div className="h-8 bg-neutral-200 rounded-lg w-40 mx-auto mb-2" />
      <div className="h-4 bg-neutral-200 rounded-lg w-56 mx-auto mb-6" />
      <div className="h-24 bg-neutral-200 rounded-2xl mb-8" />
      <div className="h-14 bg-neutral-200 rounded-xl mb-3" />
      <div className="h-14 bg-neutral-200 rounded-xl" />
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<ErrorPageSkeleton />}>
      <ErrorContent />
    </Suspense>
  );
}
