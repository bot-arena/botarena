'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
}

/**
 * A retro-styled button component with primary and secondary variants.
 * Used throughout the application for call-to-action buttons.
 */
export const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ children, className, variant = 'primary', disabled, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'btn-retro',
          variant === 'secondary' && 'bg-[var(--color-bg-secondary)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
RetroButton.displayName = 'RetroButton';
