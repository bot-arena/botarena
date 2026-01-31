'use client';

import * as React from 'react';
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'HOME' },
  { href: '/discover', label: 'DISCOVER' },
];

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> { }

/**
 * Main application navigation with responsive mobile side drawer.
 * Includes logo, navigation links, and GitHub link.
 */
export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (props, ref) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const drawerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };

      if (isMenuOpen) {
        document.addEventListener('click', handleClickOutside);
      }

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isMenuOpen]);

    React.useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isMenuOpen]);

    return (
      <>
        <header
          ref={ref}
          className="fixed top-0 left-0 right-0 h-[60px] bg-[var(--color-bg-secondary)] border-b-2 border-[var(--color-border-strong)] z-50"
          {...props}
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[var(--color-accent-primary)] border border-[var(--color-border-strong)] flex items-center justify-center group-hover:bg-[var(--color-accent-secondary)] transition-colors">
                <span className="text-[var(--color-bg-panel)] text-sm">BA</span>
              </div>
              <span className="text-sm font-bold uppercase">BOTARENA</span>
              <span className="text-xs font-bold uppercase">v0.1.0</span>
            </Link>

            <nav className="hidden md:flex gap-4" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="uppercase text-xs font-bold px-3 py-2 hover:bg-[var(--color-bg-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a
              href="https://github.com/bot-arena/botarena"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block uppercase text-xs font-bold px-3 py-2 border border-[var(--color-border-strong)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors"
            >
              GITHUB
            </a>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="md:hidden p-2 border border-[var(--color-border-strong)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile side drawer */}
        {isMenuOpen && (
          <div className="md:hidden">
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/50 z-40" />

            {/* Drawer panel */}
            <div
              ref={drawerRef}
              id="mobile-navigation"
              className="fixed top-[60px] right-0 bottom-0 w-[280px] bg-[var(--color-bg-secondary)] border-l-2 border-[var(--color-border-strong)] z-50 shadow-xl transform translate-x-0 transition-transform duration-300 ease-out"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col h-full">
                <div className="flex-1 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-6 py-4 uppercase text-xs font-bold border-b border-[var(--color-border-strong)] hover:bg-[var(--color-bg-primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="p-4 border-t border-[var(--color-border-strong)]">
                  <a
                    href="https://github.com/bot-arena/botarena"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center uppercase text-xs font-bold px-4 py-3 border border-[var(--color-border-strong)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors"
                  >
                    GITHUB
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }
);
Navigation.displayName = 'Navigation';
