'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const statusColors = {
  active: 'text-[var(--color-accent-success)]',
  good: 'text-[var(--color-accent-primary)]',
  warning: 'text-[var(--color-accent-warning)]',
  critical: 'text-[var(--color-accent-critical)]',
} as const;

export type StatBoxStatus = keyof typeof statusColors;

export interface StatBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Label displayed above the value
   */
  label: string;
  /**
   * The primary value to display
   */
  value: string | number;
  /**
   * Visual status indicator
   * @default 'active'
   */
  status?: StatBoxStatus;
}

/**
 * A statistics display box with a label, value, and status indicator.
 * Used for showing bot metrics like skill counts, MCP counts, etc.
 */
export const StatBox = React.forwardRef<HTMLDivElement, StatBoxProps>(
  ({ label, value, status = 'active', className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('stat-box', className)} {...props}>
        <div className="section-label">{label}</div>
        <div className="text-lg font-bold mb-1">{value}</div>
        <div className={cn('text-xs uppercase', statusColors[status])}>
          STATUS: {status.toUpperCase()}
        </div>
      </div>
    );
  }
);
StatBox.displayName = 'StatBox';
