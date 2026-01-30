'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ConfigFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The configuration field label (e.g., "PRIMARY_MODEL")
   */
  label: string;
  /**
   * The value to display - can be a string, number, or array
   */
  value: string | number | string[];
}

/**
 * A configuration field display component for bot detail views.
 * Shows a label-value pair with proper truncation for long values.
 */
export const ConfigField = React.forwardRef<HTMLDivElement, ConfigFieldProps>(
  ({ label, value, className, ...props }, ref) => {
    const displayValue = Array.isArray(value) ? value.join(', ') : value;

    return (
      <div
        ref={ref}
        className={cn(
          'flex justify-between border-b border-[var(--color-border-weak)] py-1',
          className
        )}
        {...props}
      >
        <span className="text-[10px] uppercase text-[var(--color-text-secondary)]">
          {label}
        </span>
        <span
          className="text-[10px] font-bold max-w-[60%] truncate"
          title={String(displayValue)}
        >
          {displayValue}
        </span>
      </div>
    );
  }
);
ConfigField.displayName = 'ConfigField';
