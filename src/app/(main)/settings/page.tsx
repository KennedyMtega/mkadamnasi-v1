'use client';

import { useState } from 'react';
import { Globe, Bell, Shield, Moon, Smartphone, LogOut, ChevronRight, HelpCircle, Flag, Crown, Info, Trash2 } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon, label, description, action, onClick, danger }: SettingItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-100 transition-colors text-left"
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-semantic-error' : 'text-neutral-900'}`}>{label}</p>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
      {action || <ChevronRight size={18} className="text-neutral-300 shrink-0" />}
    </button>
  );
}

export default function SettingsPage() {
  const [language, setLanguage] = useState('sw');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-semantic-success' : 'bg-neutral-300'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-neutral-0 shadow-sm transition-transform mx-1 ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Mipangilio" showBack />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Mipangilio</h1>
      </div>

      <div className="py-4 space-y-4">
        {/* Account */}
        <div>
          <p className="px-4 lg:px-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Akaunti</p>
          <Card className="rounded-none lg:rounded-2xl lg:mx-6 divide-y divide-neutral-300">
            <SettingItem
              icon={<Shield size={20} className="text-semantic-success" />}
              label="Faragha na Usalama"
              description="Usimamizi wa data yako ya siri"
            />
            <SettingItem
              icon={<Crown size={20} className="text-semantic-warning" />}
              label="Mkadamnasi Premium"
              description="Bado huna Premium"
              action={<Badge variant="warning" size="sm">Boresha</Badge>}
            />
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <p className="px-4 lg:px-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Mapendeleo</p>
          <Card className="rounded-none lg:rounded-2xl lg:mx-6 divide-y divide-neutral-300">
            <SettingItem
              icon={<Globe size={20} className="text-semantic-info" />}
              label="Lugha"
              description={language === 'sw' ? 'Kiswahili' : 'English'}
              action={
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-brand-primary bg-transparent font-medium"
                >
                  <option value="sw">Kiswahili</option>
                  <option value="en">English</option>
                </select>
              }
            />
            <SettingItem
              icon={<Bell size={20} className="text-brand-primary" />}
              label="Arifa"
              description={notifications ? 'Zimewashwa' : 'Zimezimwa'}
              action={<Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />}
            />
            <SettingItem
              icon={<Moon size={20} className="text-neutral-700" />}
              label="Hali ya Giza"
              description={darkMode ? 'Imewashwa' : 'Imezimwa'}
              action={<Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            />
          </Card>
        </div>

        {/* Support */}
        <div>
          <p className="px-4 lg:px-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Msaada</p>
          <Card className="rounded-none lg:rounded-2xl lg:mx-6 divide-y divide-neutral-300">
            <SettingItem
              icon={<HelpCircle size={20} className="text-semantic-info" />}
              label="Msaada & Maswali"
            />
            <SettingItem
              icon={<Flag size={20} className="text-semantic-warning" />}
              label="Ripoti Tatizo"
            />
            <SettingItem
              icon={<Info size={20} className="text-neutral-500" />}
              label="Kuhusu Mkadamnasi"
              description="Toleo 1.0.0"
            />
          </Card>
        </div>

        {/* Danger */}
        <div>
          <Card className="rounded-none lg:rounded-2xl lg:mx-6 divide-y divide-neutral-300">
            <SettingItem
              icon={<LogOut size={20} className="text-semantic-error" />}
              label="Ondoka"
              danger
            />
            <SettingItem
              icon={<Trash2 size={20} className="text-semantic-error" />}
              label="Futa Akaunti"
              description="Hatua hii haiwezi kutenduliwa"
              danger
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
