import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single string, merging Tailwind classes.
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function formatFullDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).toUpperCase();
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}D_AGO`;
  if (hours > 0) return `${hours}H_AGO`;
  if (minutes > 0) return `${minutes}M_AGO`;
  return 'JUST_NOW';
}

export function getBotIcon(llm: string): string {
  const icons: Record<string, string> = {
    'GPT-4': '🧠',
    'GPT-3.5': '🤖',
    'Claude-3': '🎭',
    'Claude': '🎭',
    'Gemini': '♊',
    'Llama': '🦙',
  };
  
  const key = Object.keys(icons).find(k => llm.includes(k));
  return key ? icons[key] : '⚡';
}

export function calculateRarity(skills: string[], mcps: string[]): string {
  const total = skills.length + mcps.length;
  if (total >= 10) return 'MYTHIC';
  if (total >= 7) return 'LEGENDARY';
  if (total >= 5) return 'EPIC';
  if (total >= 3) return 'RARE';
  return 'COMMON';
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    'COMMON': 'text-[var(--color-text-secondary)]',
    'RARE': 'text-[var(--color-accent-primary)]',
    'EPIC': 'text-[var(--color-accent-success)]',
    'LEGENDARY': 'text-[var(--color-accent-warning)]',
    'MYTHIC': 'text-[var(--color-accent-critical)]',
  };
  return colors[rarity] || colors['COMMON'];
}

export function calculateRarityScore(profile: any): number {
  const skills = profile.skills?.length || 0;
  const mcps = profile.mcps?.length || 0;
  const clis = profile.clis?.length || 0;
  return skills + mcps + clis;
}

export function countActiveFilters(filters: Record<string, any>): number {
  return Object.values(filters).filter(v => v && v !== 'all').length;
}
