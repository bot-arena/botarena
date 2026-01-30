'use client';

import Link from 'next/link';
import { cn, calculateRarity, getRarityColor, formatTimestamp } from '@/lib/utils';
import { RetroCard } from './RetroCard';
import { Badge } from './Badge';

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
 * A card component displaying bot profile information.
 * Shows name, rarity, skills, MCPs, CLIs, and LLM configuration.
 * Links to the bot's detail page.
 */
export function BotCard({ profile, className }: BotCardProps) {
  const rarity = calculateRarity(profile.skills, profile.mcps);
  const rarityColor = getRarityColor(rarity);

  if (!profile.slug) {
    return null;
  }

  return (
    <Link
      href={`/bots/${profile.slug}`}
      className={cn('block group', className)}
    >
        <RetroCard interactive>
          <div className="border-b border-[var(--color-border-strong)] pb-3 mb-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">
                  BOT_NAME
                </div>
                <h3 className="text-sm font-bold truncate">{profile.name}</h3>
              </div>
              <Badge active className={rarityColor}>
                {rarity}
              </Badge>
            </div>

            <div className="flex gap-2 text-[9px]">
              <span className="bg-[var(--color-bg-secondary)] px-1 border border-[var(--color-border-strong)]">
                {profile.harness}
              </span>
              <span className="bg-[var(--color-bg-secondary)] px-1 border border-[var(--color-border-strong)]">
                v{profile.version}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">
              YEARBOOK_QUOTE
            </div>
            <p className="text-[10px] italic text-[var(--color-text-primary)] line-clamp-2">
              &ldquo;{profile.description}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <StatItem
              value={profile.skills.length}
              label="SKILLS"
              color="text-[var(--color-accent-primary)]"
            />
            <StatItem
              value={profile.mcps.length}
              label="MCPS"
              color="text-[var(--color-accent-success)]"
            />
            <StatItem
              value={profile.clis?.length ?? 0}
              label="CLIS"
              color="text-[var(--color-accent-warning)]"
            />
          </div>

          <div className="border-t border-[var(--color-border-strong)] pt-3">
            <div className="flex justify-between items-center gap-2">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)] truncate">
                PRIMARY_LLM: {profile.llm.primary}
              </div>
              <div className="text-[9px] text-[var(--color-text-tertiary)] shrink-0">
                UPDATED: {formatTimestamp(profile.updatedAt)}
              </div>
            </div>
          </div>

          <div className="mt-2 text-right text-[9px] uppercase text-[var(--color-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
            VIEW_DETAILS &gt;
          </div>
        </RetroCard>
      </Link>
  );
}

interface StatItemProps {
  value: number;
  label: string;
  color: string;
}

function StatItem({ value, label, color }: StatItemProps) {
  return (
    <div className="bg-[var(--color-bg-secondary)] p-2 text-center border border-[var(--color-border-strong)]">
      <div className={cn('text-sm font-bold', color)}>{value}</div>
      <div className="text-[8px] uppercase">{label}</div>
    </div>
  );
}
