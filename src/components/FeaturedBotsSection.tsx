'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BotCard, BotCardProfile } from '@/components/BotCard';

/**
 * Featured bots section with grid of bot cards.
 */
export function FeaturedBotsSection() {
  const profiles = useQuery(api.botProfiles.listProfiles, { limit: 3 });
  const featuredBots: BotCardProfile[] = (profiles ?? []).map((profile) => {
    const modelPrimary = profile.modelPrimary ?? 'UNKNOWN';
    const modelFallbacks = profile.modelFallbacks ?? [];

    return {
      id: String(profile._id),
      slug: profile.slug,
      name: profile.name,
      harness: profile.harness,
      version: profile.version,
      description: profile.description,
      skills: profile.skills ?? [],
      mcps: profile.mcps ?? [],
      clis: profile.clis ?? [],
      llm: {
        primary: modelPrimary,
        fallbacks: modelFallbacks,
      },
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
      updatedAt: profile.updateTime ?? new Date(profile._creationTime).toISOString(),
    };
  });

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase">FEATURED_BOTS</h2>
        <Link
          href="/discover"
          className="text-xs uppercase text-[var(--color-accent-primary)]"
        >
          VIEW_ALL &gt;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredBots.map((bot) => (
          <BotCard key={bot.id} profile={bot} />
        ))}
      </div>
    </section>
  );
}
