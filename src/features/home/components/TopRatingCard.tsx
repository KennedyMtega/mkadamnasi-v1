import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { CATEGORIES } from '@/lib/constants';

interface TopRatingCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  totalRatings: number;
}

export default function TopRatingCard({ id, name, category, rating, totalRatings }: TopRatingCardProps) {
  const categoryIcon = CATEGORIES.find(c => c.name === category)?.icon || '📍';

  return (
    <Link href={`/rate/${id}`}>
      <Card className="hover:border-brand-primary transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 text-2xl">
            {categoryIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900 truncate">{name}</h3>
            <Badge variant="orange" size="sm" className="mt-1">{category}</Badge>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={rating} size="sm" />
              <span className="text-xs font-semibold text-neutral-900">{rating}</span>
              <span className="text-xs text-neutral-500">({totalRatings.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
