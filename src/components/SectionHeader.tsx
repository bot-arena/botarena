'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * A section header component with consistent styling.
 * Used for section titles with uppercase, border-bottom styling.
 */
export const SectionHeader = React.forwardRef<HTMLHeadingElement, SectionHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'text-xs font-bold uppercase mb-4 border-b border-[var(--color-border-strong)] pb-2',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
