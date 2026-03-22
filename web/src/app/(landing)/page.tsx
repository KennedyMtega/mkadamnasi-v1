'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  Trophy,
  BarChart3,
  Download,
  ArrowRight,
  Smartphone,
  Vote,
  Eye,
  Building2,
  TrendingUp,
  Users,
  CheckCircle,
} from 'lucide-react';

function AnimatedCounter({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toLocaleString();
  };

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl lg:text-5xl font-bold text-brand-primary">
        {formatCount(count)}{suffix}
      </p>
      <p className="text-sm text-neutral-500 mt-2">{label}</p>
    </div>
  );
}

const features = [
  {
    icon: ShieldCheck,
    title: 'Kura ya Siri (Anonymous Voting)',
    description: 'Piga kura bila mtu yeyote kujua. Utambulisho wako unalindwa kwa teknolojia ya hali ya juu.',
    descriptionEn: 'Vote without anyone knowing. Your identity is protected with advanced technology.',
  },
  {
    icon: Star,
    title: 'Tathmini ya Nyota (Star Ratings)',
    description: 'Kadiria biashara, huduma, na watu kwa uaminifu kamili.',
    descriptionEn: 'Rate businesses, services, and people with complete honesty.',
  },
  {
    icon: Trophy,
    title: 'Vipaji vya Jamii (Community Rankings)',
    description: 'Tazama vipaji vinavyoongoza katika kila kategoria na eneo.',
    descriptionEn: 'See who leads in every category and region.',
  },
  {
    icon: BarChart3,
    title: 'Matokeo ya Moja kwa Moja (Real-time Results)',
    description: 'Fuatilia matokeo yanapoingia papo hapo. Data ya moja kwa moja.',
    descriptionEn: 'Track results as they come in instantly. Real-time data.',
  },
];

const steps = [
  {
    icon: Smartphone,
    number: '01',
    title: 'Pakua App (Download)',
    description: 'Pakua Mkadamnasi kutoka App Store au Google Play. Anza kwa sekunde chache.',
    descriptionEn: 'Download Mkadamnasi from App Store or Google Play. Start in seconds.',
  },
  {
    icon: Vote,
    number: '02',
    title: 'Piga Kura / Kadiria (Vote / Rate)',
    description: 'Chagua kura, kadiria biashara, au unda kura yako mwenyewe.',
    descriptionEn: 'Choose a poll, rate a business, or create your own vote.',
  },
  {
    icon: Eye,
    number: '03',
    title: 'Tazama Matokeo (See Results)',
    description: 'Fuatilia matokeo, angalia ratings, na uone nani anaongoza.',
    descriptionEn: 'Follow results, check ratings, and see who leads.',
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary-light via-neutral-0 to-neutral-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              <ShieldCheck size={16} />
              <span>Jukwaa la Kwanza la Kitanzania la Kupiga Kura kwa Siri</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-neutral-900 leading-tight">
              Mkadamnasi
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-primary mt-2">
              Sauti Yako, Siri Yako
            </p>
            <p className="text-lg text-neutral-700 mt-6 max-w-2xl mx-auto leading-relaxed">
              Piga kura, kadiria biashara, na ushiriki katika maamuzi ya jamii yako -- kwa siri kamili.
            </p>
            <p className="text-base text-neutral-500 mt-2 max-w-2xl mx-auto">
              Vote, rate businesses, and participate in your community&apos;s decisions -- completely anonymously.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-primary text-neutral-0 font-bold text-lg hover:bg-brand-primary-dark transition-colors shadow-brand"
              >
                <Download size={20} />
                Download App
              </a>
              <Link
                href="/business/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neutral-0 text-brand-primary font-bold text-lg border-2 border-brand-primary hover:bg-brand-primary-light transition-colors"
              >
                <Building2 size={20} />
                Business Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-neutral-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
              Vipengele (Features)
            </h2>
            <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
              Zana zinazokuwezesha kushiriki kwa uhuru na uaminifu.
              <br />
              Tools that empower you to participate freely and honestly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-neutral-300 bg-neutral-0 hover:border-brand-primary hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-primary-light flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-neutral-0 transition-colors">
                    <Icon size={24} className="text-brand-primary group-hover:text-neutral-0 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">{feature.description}</p>
                  <p className="text-xs text-neutral-500 mt-2">{feature.descriptionEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
              Inavyofanya Kazi (How It Works)
            </h2>
            <p className="text-neutral-500 mt-3">
              Hatua tatu rahisi kuanza. Three simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-primary mb-6">
                    <Icon size={36} className="text-neutral-0" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full text-6xl font-bold text-brand-primary/10">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">{step.description}</p>
                  <p className="text-xs text-neutral-500 mt-2">{step.descriptionEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section id="for-business" className="py-20 lg:py-28 bg-neutral-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
                <Building2 size={16} />
                <span>Kwa Biashara (For Businesses)</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                Ongeza Uwepo Wako wa Mtandaoni
              </h2>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                Dhibiti jinsi wateja wanavyokuona. Fuatilia ratings, unda kura, na ujue maoni ya wateja wako -- yote katika jukwaa moja.
              </p>
              <p className="text-sm text-neutral-500 mb-8">
                Control how customers see you. Track ratings, create polls, and understand customer feedback -- all in one platform.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Dai na uthibitishe biashara yako (Claim & verify your business)',
                  'Fuatilia na ujibu tathmini (Monitor and respond to ratings)',
                  'Unda kura za wateja (Create customer polls)',
                  'Uchambuzi wa kina wa data (Deep analytics & insights)',
                  'Pata badge ya kuthibitishwa (Get a verified badge)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-semantic-success shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/business/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-neutral-0 font-semibold hover:bg-brand-primary-dark transition-colors shadow-brand"
              >
                Anza Sasa (Get Started)
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-brand-primary-light to-brand-primary/10 rounded-3xl p-8 lg:p-12">
                <div className="space-y-4">
                  <div className="bg-neutral-0 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-900">Overall Rating</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={16} className={s <= 4 ? 'text-semantic-warning fill-semantic-warning' : 'text-neutral-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-neutral-900">4.2</p>
                    <p className="text-xs text-neutral-500">kutoka tathmini 1,247</p>
                  </div>
                  <div className="bg-neutral-0 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-900">Active Polls</span>
                      <Vote size={18} className="text-brand-primary" />
                    </div>
                    <p className="text-3xl font-bold text-neutral-900">12</p>
                    <p className="text-xs text-semantic-success font-medium flex items-center gap-1">
                      <TrendingUp size={12} /> +3 wiki hii
                    </p>
                  </div>
                  <div className="bg-neutral-0 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-900">Total Engagements</span>
                      <Users size={18} className="text-brand-primary" />
                    </div>
                    <p className="text-3xl font-bold text-neutral-900">8.5K</p>
                    <p className="text-xs text-semantic-success font-medium flex items-center gap-1">
                      <TrendingUp size={12} /> +22% mwezi huu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-28 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-0">
              Takwimu (Statistics)
            </h2>
            <p className="text-neutral-500 mt-3">
              Idadi inayoongezeka kila siku. Growing numbers every day.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCounter target={250000} label="Kura Zilizopigwa (Votes Cast)" suffix="+" />
            <AnimatedCounter target={85000} label="Tathmini Zilizotolewa (Ratings Given)" suffix="+" />
            <AnimatedCounter target={50000} label="Watumiaji (Users)" suffix="+" />
            <AnimatedCounter target={3500} label="Biashara (Businesses)" suffix="+" />
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 lg:py-28 bg-gradient-to-br from-brand-primary to-brand-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-0 mb-4">
            Pakua Mkadamnasi Leo
          </h2>
          <p className="text-lg text-neutral-0/80 mb-4">
            Download Mkadamnasi Today
          </p>
          <p className="text-neutral-0/60 mb-10 max-w-xl mx-auto">
            Jiunge na maelfu ya Watanzania wanaoshiriki katika maamuzi muhimu kwa siri.
            Join thousands of Tanzanians participating in important decisions anonymously.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-neutral-900 text-neutral-0 font-semibold hover:bg-neutral-700 transition-colors min-w-[220px]"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-neutral-500 uppercase">Download on the</p>
                <p className="text-lg font-semibold leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-neutral-900 text-neutral-0 font-semibold hover:bg-neutral-700 transition-colors min-w-[220px]"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-neutral-500 uppercase">Get it on</p>
                <p className="text-lg font-semibold leading-tight">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
