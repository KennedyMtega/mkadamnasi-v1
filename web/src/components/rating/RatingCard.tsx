'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { formatNumber } from '@/lib/utils';

interface RatingCardProps {
  id: string;
  entityName: string;
  title: string;
  averageRating: number;
  totalRatings: number;
  isFeatured: boolean;
  category: {
    name: string;
    icon: string;
  };
  region?: string | null;
  className?: string;
}

export default function RatingCard({
  id,
  entityName,
  title,
  averageRating,
  totalRatings,
  isFeatured,
  category,
  region,
  className,
}: RatingCardProps) {
  return (
    <Link href={`/rate/${id}`}>
      <Card className={`hover:border-brand-primary transition-colors ${className ?? ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="info" size="sm">
                {category.icon} {category.name}
              </Badge>
              {isFeatured && (
                <Badge variant="warning" size="sm">Inayopendekezwa</Badge>
              )}
            </div>

            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">{entityName}</h3>
            {title !== entityName && (
              <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{title}</p>
            )}

            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={averageRating} size="sm" />
              <span className="text-xs font-semibold text-neutral-700">
                {averageRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Users size={12} />
                {formatNumber(totalRatings)} makadirio
              </span>
              {region && (
                <span className="text-xs text-neutral-400">{region}</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
