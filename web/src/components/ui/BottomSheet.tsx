'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export default function BottomSheet({ open, onClose, title, children, height = 'auto' }: BottomSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const heights = { auto: 'max-h-[85vh]', half: 'h-[50vh]', full: 'h-[95vh]' };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-modal bg-neutral-900/40 animate-fade-in lg:flex lg:items-center lg:justify-center lg:p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Mobile: bottom sheet */}
      <div className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-0 rounded-t-[20px] animate-slide-up overflow-hidden',
        heights[height]
      )}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-neutral-300">
            <h2 className="text-base font-bold text-neutral-900">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-neutral-100">
              <X size={20} className="text-neutral-500" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-4">{children}</div>
      </div>

      {/* Desktop: centered modal */}
      <div className="hidden lg:block w-full max-w-md bg-neutral-0 rounded-2xl shadow-lg overflow-hidden">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300">
            <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-neutral-100">
              <X size={20} className="text-neutral-500" />
            </button>
          </div>
        )}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
