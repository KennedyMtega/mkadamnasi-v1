'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Shield,
  Crown,
  Save,
  Camera,
  CheckCircle,
} from 'lucide-react';

export default function BusinessSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    businessName: '',
    email: '',
    phone: '',
    region: '',
    address: '',
    website: '',
    description: '',
  });
  const [notifications, setNotifications] = useState({
    newRating: true,
    pollResults: true,
    marketing: false,
    weeklyReport: true,
  });

  const updateProfile = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaved(false);
    try {
      await fetch('/api/business/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mipangilio (Settings)</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Simamia wasifu na mipangilio ya biashara yako. Manage your business profile and settings.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-semantic-success/10 border border-semantic-success/20 text-semantic-success text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          Mipangilio imehifadhiwa! (Settings saved!)
        </div>
      )}

      {/* Business Profile */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-brand-primary" />
          Wasifu wa Biashara (Business Profile)
        </h2>

        {/* Logo upload */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center">
              <Building2 size={28} className="text-neutral-400" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center shadow-sm">
              <Camera size={14} className="text-neutral-0" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">Nembo ya Biashara (Business Logo)</p>
            <p className="text-xs text-neutral-500">PNG au JPG, hadi 2MB</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Jina la Biashara (Business Name)</label>
            <div className="relative">
              <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => updateProfile('businessName', e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Barua pepe (Email)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Simu (Phone)</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Mkoa (Region)</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={profile.region}
                  onChange={(e) => updateProfile('region', e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tovuti (Website)</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => updateProfile('website', e.target.value)}
                  placeholder="https://"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Anuani (Address)</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => updateProfile('address', e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Maelezo (Description)</label>
            <textarea
              value={profile.description}
              onChange={(e) => updateProfile('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand"
          >
            <Save size={16} />
            Hifadhi Mabadiliko (Save Changes)
          </button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Bell size={18} className="text-brand-primary" />
          Arifa (Notifications)
        </h2>
        <div className="space-y-3">
          {[
            { key: 'newRating', label: 'Tathmini Mpya (New Ratings)', desc: 'Pokea arifa unapopata tathmini mpya' },
            { key: 'pollResults', label: 'Matokeo ya Kura (Poll Results)', desc: 'Pokea muhtasari wa matokeo ya kura' },
            { key: 'weeklyReport', label: 'Ripoti ya Wiki (Weekly Report)', desc: 'Muhtasari wa utendaji wa wiki' },
            { key: 'marketing', label: 'Masoko (Marketing)', desc: 'Habari na matoleo kutoka Mkadamnasi' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-neutral-100">
              <div>
                <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-brand-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-neutral-0 shadow-sm transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Subscription */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Crown size={18} className="text-brand-primary" />
          Usajili (Subscription)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              tier: 'FREE',
              label: 'Bure (Free)',
              price: 'TZS 0/mo',
              features: ['Wasifu wa msingi', 'Tathmini 5/mwezi', 'Kura 2/mwezi'],
              current: true,
            },
            {
              tier: 'PREMIUM',
              label: 'Premium',
              price: 'TZS 50,000/mo',
              features: ['Tathmini zote', 'Kura zisizo na kikomo', 'Uchambuzi wa kina', 'Badge ya uthibitisho'],
              current: false,
            },
            {
              tier: 'ENTERPRISE',
              label: 'Enterprise',
              price: 'TZS 200,000/mo',
              features: ['Kila kitu cha Premium', 'API access', 'Msaada wa kibinafsi', 'Data ya uchambuzi'],
              current: false,
            },
          ].map((plan) => (
            <div
              key={plan.tier}
              className={`p-4 rounded-xl border-2 transition-colors ${
                plan.current ? 'border-brand-primary bg-brand-primary-light' : 'border-neutral-300 hover:border-brand-primary'
              }`}
            >
              <p className="text-sm font-bold text-neutral-900">{plan.label}</p>
              <p className="text-lg font-bold text-brand-primary mt-1">{plan.price}</p>
              <ul className="mt-3 space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-neutral-600 flex items-center gap-1">
                    <CheckCircle size={12} className="text-semantic-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <div className="mt-3 text-center text-xs font-semibold text-brand-primary bg-brand-primary/10 py-1.5 rounded-lg">
                  Mpango Wako (Current Plan)
                </div>
              ) : (
                <button className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-neutral-0 transition-colors">
                  Badilisha (Upgrade)
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
