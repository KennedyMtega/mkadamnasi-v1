'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          ref={ref}
          type="search"
          className={cn(
            'w-full h-12 rounded-full bg-neutral-100 pl-11 pr-10 text-base text-neutral-900 placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-neutral-0',
            'transition-all duration-200',
            className
          )}
          value={value}
          {...props}
        />
        {value && String(value).length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-300 transition-colors"
          >
            <X size={16} className="text-neutral-500" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;
