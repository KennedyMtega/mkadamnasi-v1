import Link from 'next/link';
import { Flame, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface TrendingVoteCardProps {
  id: string;
  title: string;
  category: string;
  votes: number;
  isHot: boolean;
  timeLeft: string;
  rank: number;
}

export default function TrendingVoteCard({ id, title, category, votes, isHot, timeLeft, rank }: TrendingVoteCardProps) {
  return (
    <Link href={`/vote/${id}`}>
      <Card className="flex items-center gap-3 hover:border-brand-primary transition-colors">
        <div className="w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-primary">#{rank}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-neutral-900 truncate">{title}</h3>
            {isHot && <Flame size={14} className="text-semantic-error shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Badge variant="orange" size="sm">{category}</Badge>
            <span>👥 {votes.toLocaleString()}</span>
            <span>⏰ {timeLeft}</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-neutral-300 shrink-0" />
      </Card>
    </Link>
  );
}
