import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-neutral-100">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-xl font-bold text-neutral-900 mb-2">
        Ukurasa haupatikani
      </h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-sm">
        Ukurasa unaoutafuta haupo. Labda umeondolewa au anwani si sahihi.
      </p>
      <Link href="/">
        <Button>Rudi Nyumbani</Button>
      </Link>
    </div>
  );
}
