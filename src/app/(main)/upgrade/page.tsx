'use client';

import { useRouter } from 'next/navigation';
import { Shield, Award, Share2, Smartphone, CheckCircle } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

const BENEFITS = [
  {
    icon: Shield,
    title: 'Hifadhi maendeleo yako',
    description: 'Kura, makadirio, na pointi zako zitahifadhiwa salama.',
    color: 'text-brand-primary',
    bg: 'bg-brand-primary-light',
  },
  {
    icon: Award,
    title: 'Pata beji na pointi',
    description: 'Fungua beji maalum na ushindane kwenye leaderboard.',
    color: 'text-semantic-warning',
    bg: 'bg-yellow-50',
  },
  {
    icon: Share2,
    title: 'Shiriki na marafiki',
    description: 'Walika marafiki na upate pointi za ziada.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Smartphone,
    title: 'Ingia kwenye kifaa chochote',
    description: 'Tumia akaunti yako kwenye simu, kompyuta, au kibao.',
    color: 'text-semantic-success',
    bg: 'bg-emerald-50',
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const { isAnonymous, isAuthenticated } = useAuth();

  // If already registered, redirect to profile
  if (isAuthenticated && !isAnonymous) {
    router.replace('/profile');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Boresha Akaunti" showBack />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Boresha Akaunti Yako</h1>
        <p className="text-neutral-600 mt-1">Jiunge ili kupata uzoefu bora zaidi</p>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-5">
        {/* Benefits Section */}
        <div>
          <h2 className="text-lg font-bold text-neutral-900 mb-3">Kwa nini ujiunge?</h2>
          <div className="space-y-3">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} padding="sm" className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${benefit.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={benefit.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{benefit.title}</p>
                    <p className="text-sm text-neutral-600 mt-0.5">{benefit.description}</p>
                  </div>
                  <CheckCircle size={18} className="text-semantic-success shrink-0 mt-0.5" />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Current Progress Notice */}
        <Card className="bg-brand-primary/5 border-brand-primary/20">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-brand-primary shrink-0" />
            <p className="text-sm text-neutral-700">
              <span className="font-semibold">Maendeleo yako yako salama!</span>{' '}
              Kura, makadirio, pointi, na beji zako zote zitabaki ukijisajili.
            </p>
          </div>
        </Card>

        {/* Registration Form */}
        <div className="pt-2">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
