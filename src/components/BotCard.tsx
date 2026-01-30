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

interface ItemListProps {
  items: string[];
  label: string;
  maxDisplay?: number;
  colorClass?: string;
}

function ItemList({ items, label, maxDisplay = 3, colorClass }: ItemListProps) {
  if (items.length === 0) return null;
  
  const displayItems = items.slice(0, maxDisplay);
  const remaining = items.length - maxDisplay;
  
  return (
    <div className="mb-2">
      <div className="text-xs uppercase text-[var(--color-text-secondary)] mb-1">
        {label} ({items.length})
      </div>
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item) => (
          <span
            key={item}
            className={cn(
              "px-2 py-0.5 text-xs border border-[var(--color-border-strong)]",
              colorClass || "bg-[var(--color-bg-secondary)]"
            )}
          >
            {item}
          </span>
        ))}
        {remaining > 0 && (
          <span className="px-2 py-0.5 text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)]">
            +{remaining}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * A card component displaying bot profile information.
 * Shows avatar, name, LLM, skills, MCPs, CLIs, and links to detail page.
 */
export function BotCard({ profile, className }: BotCardProps) {
  const rarity = calculateRarity(profile.skills, profile.mcps);
  const rarityColor = getRarityColor(rarity);
  const { initial, bgClass } = getBotIcon(profile.name);

  if (!profile.slug) {
    return null;
  }

  return (
    <Link
      href={`/bots/${profile.slug}`}
      className={cn('block group', className)}
    >
      <RetroCard interactive>
        {/* Header with Avatar, Name, and LLM */}
        <div className="border-b border-[var(--color-border-strong)] pb-3 mb-3">
          <div className="flex items-start gap-3 mb-2">
            {/* Avatar */}
            <div 
              className={cn(
                "w-10 h-10 flex items-center justify-center text-white font-bold text-lg border border-[var(--color-border-strong)] shrink-0",
                bgClass
              )}
            >
              {initial}
            </div>
            
            {/* Name and Badges */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold truncate">{profile.name}</h3>
                <Badge active className={rarityColor}>
                  {rarity}
                </Badge>
              </div>
              
              <div className="flex gap-2 text-xs">
                <span className="bg-[var(--color-bg-secondary)] px-1.5 py-0.5 border border-[var(--color-border-strong)]">
                  {profile.harness}
                </span>
                <span className="bg-[var(--color-bg-secondary)] px-1.5 py-0.5 border border-[var(--color-border-strong)]">
                  v{profile.version}
                </span>
              </div>
            </div>
          </div>
          
          {/* Prominent LLM Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase text-[var(--color-text-secondary)]">
              LLM
            </span>
            <span className="px-2 py-0.5 text-sm font-medium bg-[var(--color-accent-primary)] text-white border border-[var(--color-border-strong)]">
              {profile.llm.primary}
              {profile.llm.fallbacks && profile.llm.fallbacks.length > 0 && (
                <span className="text-xs opacity-80 ml-1">
                  +{profile.llm.fallbacks.length}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <div className="text-xs uppercase text-[var(--color-text-secondary)] mb-1">
            About
          </div>
          <p className="text-sm italic text-[var(--color-text-primary)] line-clamp-2">
            &ldquo;{profile.description}&rdquo;
          </p>
        </div>

        {/* Item Lists - Skills, MCPs, CLIs */}
        <ItemList
          items={profile.skills}
          label="Skills"
          maxDisplay={3}
          colorClass="bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
        />
        
        <ItemList
          items={profile.mcps}
          label="MCPs"
          maxDisplay={2}
          colorClass="bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]"
        />
        
        {profile.clis && profile.clis.length > 0 && (
          <ItemList
            items={profile.clis}
            label="CLIs"
            maxDisplay={2}
            colorClass="bg-[var(--color-accent-warning)]/10 text-[var(--color-accent-warning)]"
          />
        )}

        {/* Footer with Updated timestamp */}
        <div className="border-t border-[var(--color-border-strong)] pt-3 mt-2">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[var(--color-text-tertiary)]">
              Updated: {formatTimestamp(profile.updatedAt)}
            </div>
            <div className="text-xs uppercase text-[var(--color-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              View Profile →
            </div>
          </div>
        </div>
      </RetroCard>
    </Link>
  );
}
