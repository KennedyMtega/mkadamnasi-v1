'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-neutral-700 mb-2">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-14 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-0 px-4 pr-10 text-base text-neutral-900 appearance-none',
              'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
              'transition-colors',
              error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-xs text-semantic-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
