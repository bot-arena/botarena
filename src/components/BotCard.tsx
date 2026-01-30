'use client';

import Link from 'next/link';
import { cn, calculateRarity, getRarityColor, formatTimestamp } from '@/lib/utils';
import { RetroCard } from './RetroCard';
import { Badge } from './Badge';
import { Tag } from './Tag';

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

/**
 * Generates a bot avatar with initial and color based on bot name
 */
function getBotIcon(name: string): { initial: string; bgClass: string } {
  const initial = name.charAt(0).toUpperCase();

  // Generate color based on name hash for consistency
  const colors = [
    'bg-amber-600',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-rose-600',
    'bg-cyan-600',
    'bg-orange-600',
    'bg-indigo-600',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const bgClass = colors[Math.abs(hash) % colors.length];

  return { initial, bgClass };
}

/**
 * A card component displaying bot profile information.
 * Shows avatar, name, LLM, skills, MCPs, CLIs, and links to detail page.
 */
export function BotCard({ profile, className }: BotCardProps) {
  const rarity = calculateRarity(profile.skills, profile.mcps);
  const rarityColor = getRarityColor(rarity);
  const { initial, bgClass } = getBotIcon(profile.name);
  const fallbackCount = profile.llm.fallbacks?.length ?? 0;

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
          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Mark
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-8 h-8 flex items-center justify-center text-white font-bold text-sm border border-[var(--color-border-strong)]',
                  bgClass
                )}
              >
                {initial}
              </span>
              <span className="text-xs uppercase text-[var(--color-text-tertiary)]">
                ID
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Name
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--color-text-primary)]">
                {profile.name}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Rarity
            </span>
            <div className="flex items-center gap-2">
              <Badge active className={cn('text-[10px] uppercase', rarityColor)}>
                {rarity}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              LLM
            </span>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {profile.llm.primary}
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {fallbackCount > 0 ? `+${fallbackCount} fallback${fallbackCount > 1 ? 's' : ''}` : 'Primary only'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Quote
            </span>
            <p className="text-sm leading-snug text-[var(--color-text-primary)]">
              &ldquo;{profile.description}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Harness
            </span>
            <div className="flex flex-wrap gap-1">
              <Tag className="text-[10px] px-1.5 py-0.5">{profile.harness}</Tag>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Version
            </span>
            <div className="flex flex-wrap gap-1">
              <Tag className="text-[10px] px-1.5 py-0.5">v{profile.version}</Tag>
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              Skills
            </span>
            <div className="flex flex-wrap gap-1">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <Tag key={skill} variant="primary" className="text-[10px] px-1.5 py-0.5">
                    {skill}
                  </Tag>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)]">None</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              MCPs
            </span>
            <div className="flex flex-wrap gap-1">
              {profile.mcps.length > 0 ? (
                profile.mcps.map((mcp) => (
                  <Tag key={mcp} variant="success" className="text-[10px] px-1.5 py-0.5">
                    {mcp}
                  </Tag>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)]">None</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              CLIs
            </span>
            <div className="flex flex-wrap gap-1">
              {profile.clis && profile.clis.length > 0 ? (
                profile.clis.map((cli) => (
                  <Tag key={cli} variant="warning" className="text-[10px] px-1.5 py-0.5">
                    {cli}
                  </Tag>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)]">None</span>
              )}
            </div>
          </div>
        </div>
      </RetroCard>
    </Link>
  );
}
