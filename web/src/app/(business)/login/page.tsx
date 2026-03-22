'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function BusinessLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/business/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      router.push('/business/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Imeshindikana kuingia. Jaribu tena. (Login failed. Try again.)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center">
              <Building2 size={28} className="text-neutral-0" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Ingia Biashara (Business Login)</h1>
          <p className="text-sm text-neutral-500 mt-2">
            Ingia kwenye akaunti yako ya biashara
            <br />
            Sign in to your business account
          </p>
        </div>

        {/* Form */}
        <div className="bg-neutral-0 rounded-2xl border border-neutral-300 p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-semantic-error/20 text-semantic-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Barua pepe (Email)
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="biashara@mfano.com"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nenosiri (Password)
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingiza nenosiri"
                  required
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary" />
                <span className="text-sm text-neutral-600">Nikumbuke (Remember me)</span>
              </label>
              <a href="#" className="text-sm text-brand-primary hover:underline font-medium">
                Umesahau? (Forgot?)
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-0 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Ingia (Sign In)
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          Huna akaunti? (Don&apos;t have an account?)
          <Link href="/business/register" className="text-brand-primary font-semibold ml-1 hover:underline">
            Jisajili (Register)
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700">
            &larr; Rudi Nyumbani (Back Home)
          </Link>
        </p>
      </div>
    </div>
  );
}
