'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        {/* Brand header */}
        <div className="pt-12 pb-6 px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary shadow-brand mb-4">
            <span className="text-3xl font-bold text-neutral-0">M</span>
          </div>
          <h2 className="text-lg font-bold text-brand-primary tracking-tight">
            Mkadamnasi
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Sauti Yako, Siri Yako</p>
        </div>

        {/* Centered content */}
        <main className="flex-1 flex flex-col items-center px-4 pb-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-4 text-center">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Mkadamnasi. Haki zote zimehifadhiwa.
          </p>
        </footer>
      </div>
    </SessionProvider>
  );
}
