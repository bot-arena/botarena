'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/discover', label: 'DISCOVER' },
    { href: '/compare', label: 'COMPARE' },
    { href: '/docs', label: 'DOCS' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-[var(--color-bg-secondary)] border-b-2 border-[var(--color-border-strong)] z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[var(--color-accent-primary)] border border-[var(--color-border-strong)] flex items-center justify-center group-hover:bg-[var(--color-accent-secondary)] transition-colors">
              <span className="text-[var(--color-bg-panel)] text-sm">BA</span>
            </div>
            <span className="text-[14px] font-bold uppercase">BOTARENA</span><span className="text-[9px] font-bold uppercase">v0.1.0</span>
          </Link>

          <nav className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="uppercase text-[10px] font-bold px-3 py-2 hover:bg-[var(--color-bg-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href="https://github.com/bot-arena/botarena"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block uppercase text-[10px] font-bold px-3 py-2 border border-[var(--color-border-strong)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors"
          >
            GITHUB
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border border-[var(--color-border-strong)] hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <footer className="fixed bottom-0 left-0 right-0 h-[80px] bg-[var(--color-bg-secondary)] border-t-2 border-[var(--color-border-strong)] z-50 md:hidden">
        <div className="grid grid-cols-4 h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center border-r border-[var(--color-border-strong)] last:border-r-0 hover:bg-[var(--color-bg-primary)] transition-colors"
            >
              <span className="text-[9px] font-bold uppercase">{link.label}</span>
            </Link>
          ))}
        </div>
      </footer>
    </>
  );
}
