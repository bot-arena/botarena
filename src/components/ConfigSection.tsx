'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ConfigSectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The section title displayed in the header
   */
  title: string;
  /**
   * Whether the section is initially expanded
   * @default false
   */
  expanded?: boolean;
  /**
   * Optional count to display in the header
   */
  count?: number;
}

/**
 * A collapsible configuration section component.
 * Used in bot detail views to organize configuration into expandable sections.
 */
export const ConfigSection = React.forwardRef<HTMLElement, ConfigSectionProps>(
  ({ title, children, expanded = false, count, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(expanded);

    return (
      <section ref={ref} className={cn('config-section', className)} {...props}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="config-header"
          aria-expanded={isOpen}
          aria-controls={`config-content-${title}`}
        >
          <span>{count !== undefined ? `${title} [${count}]` : title}</span>
          <span className="text-xs" aria-hidden="true">
            {isOpen ? '[-]' : '[+]'}
          </span>
        </button>
        {isOpen && (
          <div id={`config-content-${title}`} className="config-content">
            {children}
          </div>
        )}
      </section>
    );
  }
);
ConfigSection.displayName = 'ConfigSection';
