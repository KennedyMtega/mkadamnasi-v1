'use client';

import { Suspense } from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

function LoginPageSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto animate-pulse">
      <div className="text-center mb-8">
        <div className="h-8 bg-neutral-200 rounded-lg w-48 mx-auto" />
        <div className="h-4 bg-neutral-200 rounded-lg w-64 mx-auto mt-3" />
      </div>
      <div className="space-y-4">
        <div className="h-14 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div>
      {/* Welcome text */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Karibu Mkadamnasi
        </h1>
        <p className="text-neutral-600 mt-2 text-sm">
          Piga kura, kadiria, na ushiriki kwa siri
          <br />
          <span className="text-neutral-500">(Vote, rate, and participate anonymously)</span>
        </p>
      </div>

      <Suspense fallback={<LoginPageSkeleton />}>
        <LoginForm />
      </Suspense>

      {/* Info note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500 leading-relaxed">
          Kwa kuendelea, unakubali{' '}
          <a href="/about" className="text-brand-primary hover:underline">
            Masharti ya Matumizi
          </a>{' '}
          na{' '}
          <a href="/about" className="text-brand-primary hover:underline">
            Sera ya Faragha
          </a>
        </p>
      </div>
    </div>
  );
}
