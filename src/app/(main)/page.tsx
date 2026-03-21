import Link from 'next/link';
import { TrendingUp, ChevronRight, Star, Users, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import { CATEGORIES } from '@/lib/constants';
import { FeaturedPoll, TrendingVoteCard, TopRatingCard } from '@/features/home';

// Mock data - will be replaced with Supabase queries
const trendingVotes = [
  { id: '1', title: 'Mgahawa Bora Dar es Salaam 2026', category: 'Migahawa', votes: 12453, isHot: true, timeLeft: 'Siku 3 zimebaki' },
  { id: '2', title: 'Mwanafunzi Bora UDSM Semester Hii', category: 'Shule', votes: 8921, isHot: true, timeLeft: 'Siku 5 zimebaki' },
  { id: '3', title: 'Boda Boda vs Bajaji - Usafiri Bora?', category: 'Usafiri', votes: 6234, isHot: false, timeLeft: 'Wiki 1 imebaki' },
  { id: '4', title: 'Saluni Bora Mwanza', category: 'Saluni', votes: 4122, isHot: false, timeLeft: 'Siku 10 zimebaki' },
];

const topRatings = [
  { id: '1', name: 'Hyatt Regency Dar', category: 'Migahawa', rating: 4.7, totalRatings: 2341 },
  { id: '2', name: 'Mlimani City Mall', category: 'Maduka', rating: 4.3, totalRatings: 5672 },
  { id: '3', name: 'KKKT Azania', category: 'Huduma', rating: 4.8, totalRatings: 891 },
];

const featuredPoll = {
  id: 'featured-1',
  title: 'Jiji Bora la Kuishi Tanzania 2026',
  description: 'Piga kura kwa jiji unalolipenda zaidi kuishi Tanzania',
  votes: 45230,
  options: [
    { name: 'Dar es Salaam', percentage: 35, votes: 15830 },
    { name: 'Arusha', percentage: 28, votes: 12664 },
    { name: 'Dodoma', percentage: 20, votes: 9046 },
    { name: 'Mwanza', percentage: 17, votes: 7690 },
  ],
};

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile Header */}
      <div className="lg:hidden px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Mkadamnasi</h1>
            <p className="text-xs text-neutral-500">Sauti Yako, Siri Yako</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-brand-primary-light flex items-center justify-center">
              <Shield size={18} className="text-brand-primary" />
            </div>
          </div>
        </div>
        <SearchInput placeholder="Tafuta kura, kadirio, au biashara..." />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Karibu, Mkadamnasi! 👋</h1>
            <p className="text-neutral-700 mt-1">Gundua kura na makadirio yanayotrendi Tanzania</p>
          </div>
          <div className="w-96">
            <SearchInput placeholder="Tafuta kura, kadirio, au biashara..." />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 lg:px-6 mb-4">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-0 rounded-xl border border-neutral-300 shrink-0">
            <Users size={16} className="text-brand-primary" />
            <span className="text-xs font-semibold text-neutral-900">234K+ Watumiaji</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-0 rounded-xl border border-neutral-300 shrink-0">
            <Star size={16} className="text-semantic-warning" />
            <span className="text-xs font-semibold text-neutral-900">1.2M+ Makadirio</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-0 rounded-xl border border-neutral-300 shrink-0">
            <TrendingUp size={16} className="text-semantic-success" />
            <span className="text-xs font-semibold text-neutral-900">890K+ Kura</span>
          </div>
        </div>
      </div>

      {/* Featured Poll */}
      <div className="px-4 lg:px-6 mb-6">
        <FeaturedPoll
          id={featuredPoll.id}
          title={featuredPoll.title}
          description={featuredPoll.description}
          totalVotes={featuredPoll.votes}
          options={featuredPoll.options}
        />
      </div>

      {/* Categories */}
      <div className="px-4 lg:px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-neutral-900">Kategoria</h2>
          <Link href="/category" className="text-sm font-semibold text-brand-primary flex items-center gap-0.5">
            Zote <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-2.5">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`}>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-neutral-0 rounded-xl border border-neutral-300 hover:border-brand-primary hover:shadow-sm transition-all">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-medium text-neutral-700 text-center leading-tight">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Votes */}
      <div className="px-4 lg:px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-neutral-900">🔥 Kura Zinazotrendi</h2>
          <Link href="/trending" className="text-sm font-semibold text-brand-primary flex items-center gap-0.5">
            Zote <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {trendingVotes.map((vote, i) => (
            <TrendingVoteCard
              key={vote.id}
              id={vote.id}
              title={vote.title}
              category={vote.category}
              votes={vote.votes}
              isHot={vote.isHot}
              timeLeft={vote.timeLeft}
              rank={i + 1}
            />
          ))}
        </div>
      </div>

      {/* Top Ratings */}
      <div className="px-4 lg:px-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-neutral-900">⭐ Makadirio ya Juu</h2>
          <Link href="/ratings" className="text-sm font-semibold text-brand-primary flex items-center gap-0.5">
            Zote <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {topRatings.map((item) => (
            <TopRatingCard
              key={item.id}
              id={item.id}
              name={item.name}
              category={item.category}
              rating={item.rating}
              totalRatings={item.totalRatings}
            />
          ))}
        </div>
      </div>

      {/* Anonymity Banner */}
      <div className="px-4 lg:px-6 mb-8">
        <Card className="bg-neutral-900 text-neutral-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-0/10 flex items-center justify-center shrink-0">
              <Shield size={24} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base">Bado Siri. Daima.</h3>
              <p className="text-sm text-neutral-300 mt-0.5">Kura na makadirio yako hayawezi kufuatiliwa kwako. Siri yako iko salama.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
