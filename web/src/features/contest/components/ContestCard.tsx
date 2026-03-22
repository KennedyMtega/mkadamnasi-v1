'use client';

import Link from 'next/link';
import { Users, Clock, Trophy, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';

interface ContestCardProps {
  id: string;
  title: string;
  imageUrl: string | null;
  totalVotes: number;
  contestantCount: number;
  endDate: string | null;
  category: { name: string; icon?: string };
  isFeatured: boolean;
  className?: string;
}

function getTimeLeft(endDate: string | null): string | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return 'Imekwisha';

  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays > 0) return `Siku ${diffDays} zilizobaki`;
  if (diffHours > 0) return `Saa ${diffHours} zilizobaki`;
  return 'Inakaribia kuisha';
}

export default function ContestCard({
  id,
  title,
  imageUrl,
  totalVotes,
  contestantCount,
  endDate,
  category,
  isFeatured,
  className,
}: ContestCardProps) {
  const timeLeft = getTimeLeft(endDate);
  const isExpired = timeLeft === 'Imekwisha';

  return (
    <Link href={`/contest/${id}`}>
      <Card className={`hover:border-brand-primary transition-colors overflow-hidden p-0 ${className ?? ''}`}>
        {/* Cover image */}
        <div className="relative h-36 bg-gradient-to-br from-brand-primary to-brand-primary-dark">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          {!imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy size={40} className="text-neutral-0/30" />
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning" size="sm">
                <Star size={10} className="mr-1" />
                Inayopendekezwa (Featured)
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="orange" size="sm">
              {category.icon ? `${category.icon} ` : ''}{category.name}
            </Badge>
            {isExpired && (
              <Badge variant="default" size="sm">Imefungwa</Badge>
            )}
          </div>

          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 mb-2">{title}</h3>

          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {formatNumber(totalVotes)} kura
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={12} />
              {contestantCount} washiriki
            </span>
            {timeLeft && (
              <span className={`flex items-center gap-1 ${isExpired ? 'text-semantic-error' : 'text-semantic-warning'}`}>
                <Clock size={12} />
                {timeLeft}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
