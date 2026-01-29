'use client';

import { motion } from 'motion/react';
import { ProfileCard } from './ProfileCard';
import type { PublicBotConfigType } from '../schemas/bot-config';

interface ProfileWithId extends PublicBotConfigType {
  id: string;
}

const SAMPLE_PROFILES: ProfileWithId[] = [
  {
    id: '1',
    name: 'CodeReviewer',
    description: 'A helpful AI that reviews code for best practices and potential bugs',
    harness: 'ClawdBot',
    llm: { primary: 'GPT-4', fallbacks: [] },
    skills: ['github', 'typescript', 'code-review'],
    mcps: ['github'],
    clis: [],
    version: '1.0.0',
  },
  {
    id: '2',
    name: 'DocWriter',
    description: 'An AI assistant specialized in writing clear documentation',
    harness: 'ClawdBot',
    llm: { primary: 'Claude-3', fallbacks: [] },
    skills: ['markdown', 'documentation', 'writing'],
    mcps: [],
    clis: [],
    version: '1.0.0',
  },
  {
    id: '3',
    name: 'TestBot',
    description: 'Generates comprehensive test cases for your codebase',
    harness: 'ClawdBot',
    llm: { primary: 'GPT-4', fallbacks: ['GPT-3.5'] },
    skills: ['testing', 'jest', 'vitest', 'cypress', 'playwright'],
    mcps: ['web'],
    clis: [],
    version: '1.0.0',
  },
];

export function FeaturedProfiles(): React.ReactElement {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-8 text-center"
        >
          Featured Bot Profiles
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PROFILES.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProfileCard 
                profile={profile} 
                onViewProfile={() => console.log(`View profile: ${profile.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
