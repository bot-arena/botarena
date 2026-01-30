'use client';

import { Github } from 'lucide-react';
import Link from 'next/link';
import { AnimatedHeadline } from './AnimatedHeadline';
import { TerminalOutput } from './TerminalOutput';

/**
 * Hero section with animated headline and terminal demo.
 */
export function HeroSection() {
  return (
    <section className="pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col justify-center">
          <AnimatedHeadline />
          <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-semibold">
            Spent hours configuring your bot with models, skills, MCPs,
            CLIs? <br /> Save a versioned profile on{' '}
            <span className="text-[var(--color-accent-primary)]">
              botarena.sh
            </span>{' '}
            and show it to the world.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/discover"
              className="btn-retro inline-flex items-center gap-2 bg-[var(--color-bg-secondary)]"
            >
              Explore Bots
            </Link>
            <a
              href="https://github.com/botarena/botarena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] underline underline-offset-2 inline-flex items-center gap-1"
            >
              <Github size={12} aria-hidden="true" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
        <div className="p-8">
          <TerminalOutput />
        </div>
      </div>
    </section>
  );
}
