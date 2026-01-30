'use client';

import Link from 'next/link';
import { RetroCard } from './RetroCard';
import { Badge } from './Badge';
import { cn, calculateRarity, getRarityColor, formatTimestamp } from '@/lib/utils';

interface BotCardProps {
  profile: {
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
  };
  index?: number;
}

export function BotCard({ profile }: BotCardProps) {
  const rarity = calculateRarity(profile.skills, profile.mcps);
  const rarityColor = getRarityColor(rarity);
  
  return (
    <Link href={profile.slug ? `/bots/${profile.slug}` : '#'} className="block">
      <RetroCard className="group cursor-pointer">
        <div className="border-b border-[var(--color-border-strong)] pb-3 mb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">BOT_NAME</div>
              <h3 className="text-[14px] font-bold">{profile.name}</h3>
            </div>
            <Badge active={true} className={cn(rarityColor)}>
              {rarity}
            </Badge>
          </div>
          
          <div className="flex gap-2 text-[9px]">
            <span className="bg-[var(--color-bg-secondary)] px-1 border border-[var(--color-border-strong)]">{profile.harness}</span>
            <span className="bg-[var(--color-bg-secondary)] px-1 border border-[var(--color-border-strong)]">v{profile.version}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">YEARBOOK_QUOTE</div>
          <p className="text-[10px] italic text-[var(--color-text-primary)] line-clamp-2">
            "{profile.description}"
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-[var(--color-bg-secondary)] p-2 text-center border border-[var(--color-border-strong)]">
            <div className="text-[14px] font-bold text-[var(--color-accent-primary)]">{profile.skills.length}</div>
            <div className="text-[8px] uppercase">SKILLS</div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] p-2 text-center border border-[var(--color-border-strong)]">
            <div className="text-[14px] font-bold text-[var(--color-accent-success)]">{profile.mcps.length}</div>
            <div className="text-[8px] uppercase">MCPS</div>
          </div>
          <div className="bg-[var(--color-bg-secondary)] p-2 text-center border border-[var(--color-border-strong)]">
            <div className="text-[14px] font-bold text-[var(--color-accent-warning)]">{profile.clis?.length || 0}</div>
            <div className="text-[8px] uppercase">CLIS</div>
          </div>
        </div>
        
        <div className="border-t border-[var(--color-border-strong)] pt-3">
          <div className="flex justify-between items-center">
            <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">
              PRIMARY_LLM: {profile.llm.primary}
            </div>
            <div className="text-[9px] text-[var(--color-text-tertiary)]">
              UPDATED: {formatTimestamp(profile.updatedAt)}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-right text-[9px] uppercase text-[var(--color-accent-primary)] opacity-0 group-hover:opacity-100">
          VIEW_DETAILS &gt;
        </div>
      </RetroCard>
    </Link>
  );
}
