'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, variant = 'pills', className }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex border-b border-neutral-300', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-all relative',
              activeTab === tab.id
                ? 'text-brand-primary'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-neutral-500">({tab.count})</span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-1 bg-neutral-100 rounded-xl p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-neutral-0 text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1 text-xs opacity-60">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
