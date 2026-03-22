'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, UserX } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const { login, ensureAnonymousUser } = useAuth();

  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!loginField.trim()) {
      setError('Tafadhali ingiza barua pepe au nambari ya simu');
      return;
    }
    if (!password) {
      setError('Tafadhali ingiza nywila');
      return;
    }

    setLoading(true);
    const result = await login(loginField.trim(), password);
    setLoading(false);

    if (result.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Imeshindikana kuingia. Tafadhali jaribu tena.');
    }
  }

  async function handleContinueAnonymous() {
    await ensureAnonymousUser();
    router.push('/');
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Karibu tena!</h1>
        <p className="text-neutral-600 mt-2">Ingia kwenye akaunti yako</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Barua pepe au nambari ya simu"
          type="text"
          placeholder="mfano@email.com au 0712345678"
          value={loginField}
          onChange={(e) => setLoginField(e.target.value)}
          icon={<Mail size={20} />}
          error={!loginField.trim() && error ? undefined : undefined}
          autoComplete="username"
        />

        <div className="relative">
          <Input
            label="Nywila"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingiza nywila yako"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={20} />}
            autoComplete="current-password"
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
          Ingia
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Huna akaunti?{' '}
          <a href="/auth/register" className="text-brand-primary font-semibold hover:underline">
            Jisajili
          </a>
        </p>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-neutral-0 px-4 text-sm text-neutral-500">au</span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="w-full"
        icon={<UserX size={20} />}
        onClick={handleContinueAnonymous}
      >
        Endelea bila akaunti
      </Button>
    </div>
  );
}
