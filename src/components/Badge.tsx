'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Whether the badge is in an active state
   * @default false
   */
  active?: boolean;
}

/**
 * A retro-styled badge component for displaying labels and status indicators.
 * Used for showing bot rarity, tags, and status indicators.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, active = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'badge-retro',
          active ? 'badge-active' : 'badge-inactive',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
