'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-brand-primary text-neutral-0 hover:bg-brand-primary-dark focus:ring-brand-primary shadow-brand',
      secondary: 'bg-neutral-0 text-brand-primary border-[1.5px] border-brand-primary hover:bg-brand-primary-light focus:ring-brand-primary',
      ghost: 'bg-transparent text-brand-primary hover:bg-brand-primary-light focus:ring-brand-primary',
      danger: 'bg-transparent text-semantic-error hover:bg-red-50 focus:ring-semantic-error',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg gap-1.5',
      md: 'h-12 px-6 text-base gap-2',
      lg: 'h-14 px-8 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
