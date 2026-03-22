'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Phone, MapPin, Tag, Eye, EyeOff, ArrowRight } from 'lucide-react';

const categories = [
  'Chakula & Vinywaji (Food & Drinks)',
  'Afya (Health)',
  'Elimu (Education)',
  'Teknolojia (Technology)',
  'Usafiri (Transport)',
  'Utalii (Tourism)',
  'Fedha (Finance)',
  'Burudani (Entertainment)',
  'Ujenzi (Construction)',
  'Kilimo (Agriculture)',
  'Nguo & Mitindo (Fashion)',
  'Nyingine (Other)',
];

const regions = [
  'Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar', 'Tanga',
  'Mbeya', 'Morogoro', 'Iringa', 'Kilimanjaro', 'Kagera', 'Tabora',
  'Kigoma', 'Mtwara', 'Lindi', 'Ruvuma', 'Singida', 'Shinyanga',
  'Mara', 'Rukwa', 'Pwani', 'Geita', 'Njombe', 'Simiyu',
  'Katavi', 'Songwe',
];

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    region: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Nenosiri hazifanani (Passwords do not match)');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Lazima ukubali masharti (You must accept the terms)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/business/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          category: formData.category,
          region: formData.region,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/business/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Usajili umeshindikana. Jaribu tena. (Registration failed.)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center">
              <Building2 size={28} className="text-neutral-0" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Sajili Biashara (Register Business)</h1>
          <p className="text-sm text-neutral-500 mt-2">
            Unda akaunti ya biashara yako kwenye Mkadamnasi
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
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Jina la Biashara (Business Name) *
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="Jina la biashara yako"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Barua pepe (Email) *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="biashara@mfano.com"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Simu (Phone) *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+255 7XX XXX XXX"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {/* Category & Region row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kategoria (Category) *
                </label>
                <div className="relative">
                  <Tag size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors appearance-none"
                  >
                    <option value="">Chagua...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Mkoa (Region) *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <select
                    value={formData.region}
                    onChange={(e) => updateField('region', e.target.value)}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors appearance-none"
                  >
                    <option value="">Chagua...</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nenosiri (Password) *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Angalau herufi 8"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Thibitisha Nenosiri (Confirm Password) *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Rudia nenosiri"
                  required
                  minLength={8}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => updateField('acceptTerms', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary mt-0.5"
              />
              <span className="text-sm text-neutral-600">
                Nakubali <a href="#" className="text-brand-primary hover:underline">masharti ya matumizi</a> na <a href="#" className="text-brand-primary hover:underline">sera ya faragha</a>.
                <br />
                <span className="text-xs text-neutral-500">I agree to the terms of service and privacy policy.</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-0 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sajili (Register)
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Tayari una akaunti? (Already have an account?)
          <Link href="/business/login" className="text-brand-primary font-semibold ml-1 hover:underline">
            Ingia (Sign In)
          </Link>
        </p>
      </div>
    </div>
  );
}
