'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Visual variant of the select
   * @default 'default'
   */
  variant?: 'default' | 'bold';
}

/**
 * A select dropdown component with retro styling.
 * Used for sorting options and other dropdown selections.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full border border-[var(--color-border-strong)] px-3 py-2 text-xs',
          'bg-[var(--color-bg-panel)]',
          'text-[var(--color-text-primary)]',
          variant === 'bold' && 'font-bold',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
