'use client';

import * as React from 'react';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Application footer with version info and links.
 * Hidden on mobile, visible on desktop.
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (props, ref) => {
    return (
      <footer
        ref={ref}
        className="hidden md:block py-8 text-center border-t border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]"
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-[var(--color-text-secondary)]">
            <span>BOTARENA_V1.0</span>
            <span className="hidden md:inline" aria-hidden="true">|</span>
            <a
              href="https://github.com/bot-arena/botarena"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase hover:text-[var(--color-accent-primary)] transition-colors"
            >
              GITHUB
            </a>
            <span className="hidden md:inline" aria-hidden="true">|</span>
            <span>OPEN_SOURCE</span>
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = 'Footer';
