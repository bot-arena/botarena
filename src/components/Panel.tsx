'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the panel
   * @default 'default'
   */
  variant?: 'default' | 'secondary';
}

/**
 * A secondary container component for grouping related content.
 * Used within cards or as standalone containers without the full card styling.
 * Similar to RetroCard but without the shadow and hover effects.
 */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border border-[var(--color-border-strong)]',
          variant === 'default' && 'bg-[var(--color-bg-secondary)]',
          variant === 'secondary' && 'bg-[var(--color-bg-panel)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Panel.displayName = 'Panel';
