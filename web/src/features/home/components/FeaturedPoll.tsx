import Link from 'next/link';
import { Flame, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';

interface FeaturedPollProps {
  id: string;
  title: string;
  description: string;
  totalVotes: number;
  options: Array<{ name: string; percentage: number; votes: number }>;
}

export default function FeaturedPoll({ id, title, description, totalVotes, options }: FeaturedPollProps) {
  return (
    <Link href={`/vote/${id}`}>
      <Card elevated className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-neutral-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-0/5 rounded-full -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-neutral-0/5 rounded-full -ml-6 -mb-6" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-yellow-300" />
            <span className="text-xs font-semibold text-neutral-0/80 uppercase tracking-wide">Inatrendi Sasa</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-sm text-neutral-0/70 mb-4">{description}</p>
          <div className="space-y-2.5">
            {options.map((opt, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{opt.name}</span>
                  <span className="text-neutral-0/80">{opt.percentage}%</span>
                </div>
                <div className="h-2 bg-neutral-0/20 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-0 rounded-full transition-all duration-1000" style={{ width: `${opt.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-0/20">
            <span className="text-xs text-neutral-0/70">👥 {totalVotes.toLocaleString()} wamepiga kura</span>
            <span className="text-xs font-semibold flex items-center gap-1">Piga Kura <ChevronRight size={14} /></span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
