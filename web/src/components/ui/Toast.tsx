'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export default function Toast({ message, type = 'info', visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const Icon = icons[type];

  return (
    <div className="fixed top-4 left-4 right-4 z-toast animate-fade-in">
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg',
        'bg-neutral-900 text-neutral-0'
      )}>
        <Icon size={20} className="shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
