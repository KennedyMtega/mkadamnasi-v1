'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Mail, Phone, Lock, Eye, EyeOff, User } from 'lucide-react';

type ContactMethod = 'email' | 'phone';

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (contactMethod === 'email') {
      if (!email.trim()) {
        errors.email = 'Barua pepe inahitajika';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Barua pepe si sahihi';
      }
    } else {
      if (!phone.trim()) {
        errors.phone = 'Nambari ya simu inahitajika';
      } else if (!/^(\+?255|0)\d{9}$/.test(phone.replace(/\s/g, ''))) {
        errors.phone = 'Nambari ya simu si sahihi (mfano: 0712345678)';
      }
    }

    if (username && (username.length < 3 || username.length > 30)) {
      errors.username = 'Jina la mtumiaji lazima liwe herufi 3-30';
    }
    if (username && !/^[a-zA-Z0-9_]*$/.test(username)) {
      errors.username = 'Herufi, nambari, na _ tu zinaruhusiwa';
    }

    if (!password) {
      errors.password = 'Nywila inahitajika';
    } else if (password.length < 6) {
      errors.password = 'Nywila lazima iwe na herufi 6 au zaidi';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Nywila hazifanani';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    const result = await register({
      email: contactMethod === 'email' ? email.trim().toLowerCase() : undefined,
      phone: contactMethod === 'phone' ? phone.replace(/\s/g, '') : undefined,
      password,
      username: username.trim() || undefined,
    });
    setLoading(false);

    if (result.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Imeshindikana kujisajili. Tafadhali jaribu tena.');
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Jisajili</h1>
        <p className="text-neutral-600 mt-2">Fungua akaunti yako ya Mkadamnasi</p>
      </div>

      {/* Contact method toggle */}
      <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => setContactMethod('email')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            contactMethod === 'email'
              ? 'bg-neutral-0 text-brand-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Barua pepe
        </button>
        <button
          type="button"
          onClick={() => setContactMethod('phone')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            contactMethod === 'phone'
              ? 'bg-neutral-0 text-brand-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Nambari ya simu
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {contactMethod === 'email' ? (
          <Input
            label="Barua pepe"
            type="email"
            placeholder="mfano@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: '' }));
            }}
            icon={<Mail size={20} />}
            error={fieldErrors.email}
            autoComplete="email"
          />
        ) : (
          <Input
            label="Nambari ya simu"
            type="tel"
            placeholder="0712345678"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setFieldErrors((prev) => ({ ...prev, phone: '' }));
            }}
            icon={<Phone size={20} />}
            error={fieldErrors.phone}
            autoComplete="tel"
          />
        )}

        <Input
          label="Jina la mtumiaji (si lazima)"
          type="text"
          placeholder="mfano: kura_king"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setFieldErrors((prev) => ({ ...prev, username: '' }));
          }}
          icon={<User size={20} />}
          error={fieldErrors.username}
          autoComplete="username"
        />

        <div className="relative">
          <Input
            label="Nywila"
            type={showPassword ? 'text' : 'password'}
            placeholder="Herufi 6 au zaidi"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: '' }));
            }}
            icon={<Lock size={20} />}
            error={fieldErrors.password}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-neutral-500 hover:text-neutral-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Input
          label="Thibitisha nywila"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ingiza nywila tena"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          icon={<Lock size={20} />}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-semantic-error">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          Jisajili
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Tayari una akaunti?{' '}
          <a href="/auth/login" className="text-brand-primary font-semibold hover:underline">
            Ingia
          </a>
        </p>
      </div>
    </div>
  );
}
