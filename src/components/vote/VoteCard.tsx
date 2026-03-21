'use client';

import Link from 'next/link';
import { Users, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatNumber, formatDate } from '@/lib/utils';

interface VoteCardProps {
  id: string;
  title: string;
  type: string;
  totalVotes: number;
  endDate: string | null;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    name: string;
    icon: string;
  };
  region?: string | null;
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

export default function VoteCard({
  id,
  title,
  type,
  totalVotes,
  endDate,
  isActive,
  isFeatured,
  category,
  region,
  className,
}: VoteCardProps) {
  const timeLeft = getTimeLeft(endDate);
  const isExpired = timeLeft === 'Imekwisha';

  return (
    <Link href={`/vote/${id}`}>
      <Card className={`hover:border-brand-primary transition-colors ${className ?? ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="orange" size="sm">
                {category.icon} {category.name}
              </Badge>
              {isFeatured && (
                <Badge variant="warning" size="sm">Inayopendekezwa</Badge>
              )}
              {type === 'VERSUS' && (
                <Badge variant="info" size="sm">VS</Badge>
              )}
              {!isActive && (
                <Badge variant="default" size="sm">Imefungwa</Badge>
              )}
            </div>

            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">{title}</h3>

            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {formatNumber(totalVotes)} kura
              </span>
              {timeLeft && (
                <span className={`flex items-center gap-1 ${isExpired ? 'text-semantic-error' : 'text-semantic-warning'}`}>
                  <Clock size={12} />
                  {timeLeft}
                </span>
              )}
              {region && (
                <span className="text-neutral-400">{region}</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
