'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual size variant of the label
   * @default 'default'
   */
  size?: 'default' | 'sm';
}

/**
 * A label component for form labels and section headers.
 * Provides consistent uppercase, secondary text styling.
 */
export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ children, className, size = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'uppercase text-[var(--color-text-secondary)]',
          size === 'default' && 'text-xs',
          size === 'sm' && 'text-[10px]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Label.displayName = 'Label';
