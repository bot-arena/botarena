'use client';

import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { FeaturedBotsSection } from '@/components/FeaturedBotsSection';

/**
 * Home page showcasing BotArena's features with animated headline,
 * terminal demo, how-it-works steps, and featured bots.
 */
export default function HomePage() {
  return (
    <div className="space-y-0 max-w-7xl mx-auto">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedBotsSection />
    </div>
  );
}
