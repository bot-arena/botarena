'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FilterTagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the filter tag is currently active/selected
   * @default false
   */
  active?: boolean;
}

/**
 * A filter tag button for toggling filter states.
 * Used in the discover page for filtering bots by harness type.
 */
export const FilterTag = React.forwardRef<HTMLButtonElement, FilterTagProps>(
  ({ children, active = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'filter-tag',
          active && 'active',
          className
        )}
        aria-pressed={active}
        {...props}
      >
        {children}
      </button>
    );
  }
);
FilterTag.displayName = 'FilterTag';
