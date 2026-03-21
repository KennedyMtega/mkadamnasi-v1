'use client';

import { useState } from 'react';
import { Crown, Check, Smartphone, Shield, Lock } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const BENEFITS = [
  { label: 'Kura zisizo na kikomo (Unlimited votes)', included: true },
  { label: 'Unda kura binafsi (Create private votes)', included: true },
  { label: 'Takwimu za kina (Detailed analytics)', included: true },
  { label: 'Beji maalum (Special badge)', included: true },
  { label: 'Bila matangazo (No ads)', included: true },
];

const FREE_FEATURES = [
  { label: 'Kura 10 kwa siku (10 votes per day)', included: true },
  { label: 'Makadirio yasiyo na kikomo (Unlimited ratings)', included: true },
  { label: 'Takwimu za msingi (Basic analytics)', included: true },
  { label: 'Kura binafsi (Private votes)', included: false },
  { label: 'Takwimu za kina (Detailed analytics)', included: false },
];

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', color: 'bg-green-600' },
  { id: 'tigopesa', name: 'Tigo Pesa', color: 'bg-blue-600' },
  { id: 'airtelmoney', name: 'Airtel Money', color: 'bg-red-600' },
];

type Plan = 'monthly' | 'yearly';

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('monthly');

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Premium" showBack />

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Crown size={20} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Premium</h1>
            <p className="text-neutral-700 text-sm">Pata uwezo zaidi na Premium</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-5">
        {/* Current Plan */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Mpango wako wa sasa</p>
              <p className="text-lg font-bold text-neutral-900">Bure (Free)</p>
            </div>
            <Badge variant="default" size="sm">Hai</Badge>
          </div>
        </Card>

        {/* Free Plan Features */}
        <div>
          <h2 className="text-sm font-semibold text-neutral-700 mb-2">Mpango wa Bure (Free Plan)</h2>
          <Card padding="sm">
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2.5">
                  {feature.included ? (
                    <Check size={16} className="text-semantic-success shrink-0" />
                  ) : (
                    <Lock size={16} className="text-neutral-300 shrink-0" />
                  )}
                  <span className={`text-sm ${feature.included ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Premium Plan */}
        <div>
          <h2 className="text-sm font-semibold text-neutral-700 mb-2">Mpango wa Premium (Premium Plan)</h2>
          <Card className="border-brand-primary bg-brand-primary-light/30">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={18} className="text-amber-600" />
              <span className="text-base font-bold text-neutral-900">Premium</span>
              <Badge variant="warning" size="sm">Pendekeza</Badge>
            </div>

            <ul className="space-y-2.5 mb-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit.label} className="flex items-center gap-2.5">
                  <Check size={16} className="text-semantic-success shrink-0" />
                  <span className="text-sm text-neutral-900">{benefit.label}</span>
                </li>
              ))}
            </ul>

            {/* Pricing Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                  selectedPlan === 'monthly'
                    ? 'bg-neutral-0 border-brand-primary text-brand-primary shadow-sm'
                    : 'bg-transparent border-neutral-300 text-neutral-700'
                }`}
              >
                <span className="block text-base font-bold">TZS 5,000</span>
                <span className="text-xs opacity-70">kwa mwezi</span>
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border relative ${
                  selectedPlan === 'yearly'
                    ? 'bg-neutral-0 border-brand-primary text-brand-primary shadow-sm'
                    : 'bg-transparent border-neutral-300 text-neutral-700'
                }`}
              >
                <span className="block text-base font-bold">TZS 45,000</span>
                <span className="text-xs opacity-70">kwa mwaka</span>
                <Badge variant="success" size="sm" className="absolute -top-2 -right-2">
                  -25%
                </Badge>
              </button>
            </div>
          </Card>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 className="text-sm font-semibold text-neutral-700 mb-2">Njia za Malipo (Payment Methods)</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <Card key={method.id} padding="sm">
                <button
                  className="w-full flex items-center gap-3 relative"
                  onClick={() => {/* Coming soon */}}
                  disabled
                >
                  <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center shrink-0`}>
                    <Smartphone size={18} className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-neutral-900">{method.name}</p>
                    <p className="text-xs text-neutral-500">Lipa kwa simu yako</p>
                  </div>
                  <Badge variant="default" size="sm">Hivi Karibuni</Badge>
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-neutral-900 text-neutral-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-0/10 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Malipo yanakuja hivi karibuni!</h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                Tunafanya kazi kuunganisha njia za malipo. Utaarifiwa malipo yatakapokuwa tayari.
              </p>
            </div>
          </div>
        </Card>

        {/* Upgrade Button (disabled - coming soon) */}
        <Button
          size="lg"
          className="w-full"
          disabled
          icon={<Crown size={20} />}
        >
          Boresha hadi Premium - Hivi Karibuni
        </Button>
      </div>
    </div>
  );
}
