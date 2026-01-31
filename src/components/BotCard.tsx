'use client';

import Link from 'next/link';
import { cn, formatTimestamp } from '@/lib/utils';
import { RetroCard } from './RetroCard';
import { Tag, type TagProps } from './Tag';

export interface BotCardProfile {
  id?: string;
  slug?: string;
  name: string;
  harness: string;
  version: string;
  description: string;
  skills: string[];
  mcps: string[];
  clis?: string[];
  llm: {
    primary: string;
    fallbacks?: string[];
  };
  updatedAt: Date | string;
}

export interface BotCardProps {
  profile: BotCardProfile;
  className?: string;
}

const MAX_BADGE_DISPLAY = 6;

/**
 * A card component displaying bot profile information.
 * Shows avatar, name, LLM, skills, MCPs, CLIs, and links to detail page.
 */
export function BotCard({ profile, className }: BotCardProps) {
  const fallbackCount = profile.llm.fallbacks?.length ?? 0;

  const renderBadges = (items: string[] | undefined, variant: TagProps['variant']) => {
    if (!items || items.length === 0) {
      return <span className="text-xs text-[var(--color-text-tertiary)]">None</span>;
    }

    const displayItems = items.slice(0, MAX_BADGE_DISPLAY);
    const remaining = items.length - displayItems.length;

    return (
      <>
        {displayItems.map((item) => (
          <Tag key={item} variant={variant} className="text-[10px] px-1.5 py-0.5">
            {item}
          </Tag>
        ))}
        {remaining > 0 && (
          <Tag className="text-[10px] px-1.5 py-0.5">+{remaining}</Tag>
        )}
      </>
    );
  };

  if (!profile.slug) {
    return null;
  }

  return (
    <Link href={`/bots/${profile.slug}`} className={cn('block group', className)}>
      <RetroCard interactive className="px-4 py-3">
        <div className="flex items-center justify-between border-b border-[var(--color-border-strong)] pb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            Bot Dossier
          </span>
          <span className="text-[10px] uppercase text-[var(--color-text-tertiary)]">
            Updated {formatTimestamp(profile.updatedAt)}
          </span>
        </div>

        <div className="divide-y divide-[var(--color-border-strong)]">
          <div className="flex items-start gap-4 py-3">
            <div className="flex h-[6.25rem] w-[6.25rem] items-center justify-center border border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-tertiary)]">
              Avatar
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-tight tracking-[0.08em] text-[var(--color-text-primary)]">
                {profile.name}
              </h3>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-text-tertiary)]">
                by @archiboi69
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-secondary)]">
                &ldquo;{profile.description}&rdquo;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] items-start gap-2 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              LLM
            </span>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-semibold leading-tight text-[var(--color-text-primary)]">
                {profile.llm.primary}
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {fallbackCount > 0 ? `+${fallbackCount} fallback${fallbackCount > 1 ? 's' : ''}` : 'Primary only'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] items-start gap-2 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Harness
            </span>
            <div className="flex flex-wrap gap-1">
              <Tag className="text-[10px] px-1.5 py-0.5">{profile.harness}</Tag>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] items-start gap-2 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Version
            </span>
            <div className="flex flex-wrap gap-1">
              <Tag className="text-[10px] px-1.5 py-0.5">v{profile.version}</Tag>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] items-start gap-2 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Skills
            </span>
            <div className="flex flex-wrap gap-1">
              {renderBadges(profile.skills, 'primary')}
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] items-start gap-2 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              MCPs
            </span>
            <div className="flex flex-wrap gap-1">
              {renderBadges(profile.mcps, 'success')}
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] items-start gap-2 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              CLIs
            </span>
            <div className="flex flex-wrap gap-1">
              {renderBadges(profile.clis, 'warning')}
            </div>
          </div>
        </div>
      </RetroCard>
    </Link>
  );
}
