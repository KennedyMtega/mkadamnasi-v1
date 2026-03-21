import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import { CATEGORIES } from '@/lib/constants';

export default function CategoriesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Kategoria" showBack />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Kategoria Zote</h1>
        <p className="text-neutral-700 mt-1">Vinjari kura na makadirio kwa kategoria</p>
      </div>

      <div className="px-4 lg:px-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`}>
              <Card className="flex flex-col items-center gap-2 py-6 hover:border-brand-primary hover:shadow-md transition-all">
                <span className="text-4xl">{cat.icon}</span>
                <h3 className="text-sm font-semibold text-neutral-900">{cat.name}</h3>
                <p className="text-xs text-neutral-500">{cat.nameEn}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
