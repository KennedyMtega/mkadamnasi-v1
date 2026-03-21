'use client';

import { Shield, Users, Eye, Globe, Heart, Code } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';

const APP_VERSION = '1.0.0';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-primary-light flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div>
      <TopBar title="Kuhusu (About)" showBack />

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary shadow-brand mb-4">
            <span className="text-3xl font-bold text-neutral-0">M</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Mkadamnasi</h1>
          <p className="text-sm text-brand-primary font-semibold mt-1">
            Sauti Yako, Siri Yako
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Your Voice, Your Secret
          </p>
        </div>

        {/* Mission */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-3">
            Dhamira Yetu (Our Mission)
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed mb-3">
            Mkadamnasi ni jukwaa la kwanza la Kitanzania linalowapa watu uwezo wa
            kutoa maoni yao kwa siri na uhuru kamili. Tunaamini kwamba kila sauti
            ina thamani - iwe ni kupiga kura, kukadiria, au kupanga.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            (Mkadamnasi is Tanzania&apos;s first platform that empowers people to share
            their opinions anonymously and freely. We believe every voice matters -
            whether voting, rating, or ranking.)
          </p>
        </Card>

        {/* Values */}
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          Maadili Yetu (Our Values)
        </h2>
        <div className="space-y-3 mb-8">
          <ValueCard
            icon={<Shield size={20} className="text-brand-primary" />}
            title="Faragha (Privacy)"
            description="Hatuhifadhi taarifa yoyote inayoweza kukutambulisha. Kura yako ni siri yako daima."
          />
          <ValueCard
            icon={<Users size={20} className="text-brand-primary" />}
            title="Jumuiya (Community)"
            description="Tunajenga jumuiya ya Watanzania wanaoshiriki kwa heshima na upendo."
          />
          <ValueCard
            icon={<Eye size={20} className="text-brand-primary" />}
            title="Uwazi (Transparency)"
            description="Matokeo ya kura yanaonekana kwa wote. Hakuna udanganyifu."
          />
          <ValueCard
            icon={<Globe size={20} className="text-brand-primary" />}
            title="Upatikanaji (Accessibility)"
            description="Jukwaa letu linapatikana kwa wote - kwa Kiswahili na Kiingereza, kwenye simu na kompyuta."
          />
        </div>

        {/* How it works */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-lg font-bold text-neutral-900 mb-3">
            Jinsi Inavyofanya Kazi (How It Works)
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-sm font-bold text-neutral-0">1</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Tembelea au Jisajili</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Tumia bila akaunti au jisajili kupata faida zaidi.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-sm font-bold text-neutral-0">2</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Shiriki kwa Siri</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Piga kura, kadiria, au unda kura yako mwenyewe.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-sm font-bold text-neutral-0">3</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Pata Pointi na Panda Daraja</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Kushiriki kunakupa pointi na kupandisha daraja lako.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Version & credits */}
        <Card padding="lg" className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Code size={18} className="text-neutral-500" />
            <span className="text-sm font-semibold text-neutral-700">Taarifa za Programu</span>
          </div>
          <div className="space-y-2 text-sm text-neutral-600">
            <p>
              <span className="text-neutral-500">Toleo (Version):</span>{' '}
              <span className="font-semibold text-neutral-900">{APP_VERSION}</span>
            </p>
            <p>
              <span className="text-neutral-500">Jukwaa (Platform):</span>{' '}
              <span className="font-semibold text-neutral-900">Next.js 16 + React 19</span>
            </p>
            <p>
              <span className="text-neutral-500">Lugha (Language):</span>{' '}
              <span className="font-semibold text-neutral-900">Kiswahili / English</span>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-1 text-sm text-neutral-500 mb-2">
            <span>Imetengenezwa kwa</span>
            <Heart size={14} className="text-semantic-error" />
            <span>Tanzania</span>
          </div>
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Mkadamnasi. Haki zote zimehifadhiwa.
          </p>
        </div>
      </div>
    </div>
  );
}
