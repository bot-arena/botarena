'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Visual variant of the input
   * @default 'default'
   */
  variant?: 'default' | 'dark' | 'light';
}

/**
 * An input component with retro styling.
 * Used for text inputs, search fields, and read-only URL displays.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full border border-[var(--color-border-strong)] px-3 py-2 text-xs',
          variant === 'default' && [
            'bg-[var(--color-bg-panel)]',
            'text-[var(--color-text-primary)]',
          ],
          variant === 'dark' && [
            'bg-[var(--color-bg-dark)]',
            'text-[var(--color-bg-panel)]',
          ],
          variant === 'light' && [
            'bg-[var(--color-bg-panel)]',
            'text-[var(--color-accent-code)]',
            'font-mono',
          ],
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
