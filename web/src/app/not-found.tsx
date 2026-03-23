import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-neutral-100">
      {/* Professional 404 illustration */}
      <div className="mb-8">
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="100" height="80" rx="12" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
          <text x="80" y="72" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#D1D5DB" fontFamily="system-ui">404</text>
          <circle cx="80" cy="95" r="3" fill="#E5E7EB" />
          <line x1="50" y1="40" x2="70" y2="40" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="47" x2="90" y2="47" stroke="#F3F4F6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <p className="text-xs font-semibold text-brand-primary tracking-widest uppercase mb-3">Mkadamnasi</p>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        Ukurasa Haupatikani
      </h1>
      <p className="text-sm text-neutral-500 mb-2 max-w-md">
        Ukurasa unaoutafuta haupo au umeondolewa. Hakikisha anwani ni sahihi au tumia utafutaji.
      </p>
      <p className="text-xs text-neutral-400 mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex gap-3">
        <Link href="/">
          <Button>Rudi Nyumbani</Button>
        </Link>
        <Link href="/search">
          <Button variant="secondary">Tafuta</Button>
        </Link>
      </div>
    </div>
  );
}
