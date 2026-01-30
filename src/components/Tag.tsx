'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual variant of the tag
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

/**
 * A tag component for displaying labels, categories, and metadata.
 * Used for skills, MCPs, CLIs, and other categorization needs.
 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'px-2 py-0.5 text-xs border border-[var(--color-border-strong)]',
          variant === 'default' && 'bg-[var(--color-bg-secondary)]',
          variant === 'primary' &&
            'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]',
          variant === 'success' &&
            'bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]',
          variant === 'warning' &&
            'bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Tag.displayName = 'Tag';
