'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import RegisterForm from '@/features/auth/components/RegisterForm';

function RegisterPageSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto animate-pulse">
      <div className="text-center mb-8">
        <div className="h-8 bg-neutral-200 rounded-lg w-40 mx-auto" />
        <div className="h-4 bg-neutral-200 rounded-lg w-56 mx-auto mt-3" />
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
        <div className="h-14 bg-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div>
      {/* Welcome text */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          Jiunge Mkadamnasi
        </h1>
        <p className="text-neutral-600 mt-2 text-sm">
          Fungua akaunti yako bure
          <br />
          <span className="text-neutral-500">(Create your free account)</span>
        </p>
      </div>

      <Suspense fallback={<RegisterPageSkeleton />}>
        <RegisterForm />
      </Suspense>

      {/* Terms notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-neutral-500 leading-relaxed">
          Kwa kujisajili, unakubali{' '}
          <Link href="/about" className="text-brand-primary hover:underline">
            Masharti ya Matumizi
          </Link>{' '}
          na{' '}
          <Link href="/about" className="text-brand-primary hover:underline">
            Sera ya Faragha
          </Link>{' '}
          yetu.
        </p>
      </div>

      {/* Back to login */}
      <div className="mt-4 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-brand-primary font-semibold hover:underline"
        >
          &larr; Rudi kwenye kuingia
        </Link>
      </div>
    </div>
  );
}
