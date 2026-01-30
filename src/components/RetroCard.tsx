'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RetroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Makes the card interactive with hover effects
   */
  interactive?: boolean;
}

export interface RetroCardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Makes the card interactive with hover effects
   * @default true for links
   */
  interactive?: boolean;
}

/**
 * A static retro-styled card container.
 * Used for displaying content blocks with the retro design aesthetic.
 */
export const RetroCard = React.forwardRef<HTMLDivElement, RetroCardProps>(
  ({ children, className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'retro-card',
          interactive && 'cursor-pointer hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RetroCard.displayName = 'RetroCard';

/**
 * A retro-styled card that renders as an anchor link.
 * Used for navigation cards that link to other pages.
 */
export const RetroCardLink = React.forwardRef<HTMLAnchorElement, RetroCardLinkProps>(
  ({ children, className, interactive = true, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          'retro-card block',
          interactive && 'cursor-pointer hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
RetroCardLink.displayName = 'RetroCardLink';
