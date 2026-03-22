'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-14 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-0 px-4 text-base text-neutral-900 placeholder:text-neutral-500',
              'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
              'transition-colors duration-200',
              icon && 'pl-11',
              error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-semantic-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
