import Link from 'next/link';
import { BotCard, BotCardProfile } from '@/components/BotCard';

const FEATURED_BOTS: BotCardProfile[] = [
  {
    id: '1',
    slug: 'devbot-v1',
    name: 'DevBot-V1',
    harness: 'CLAWDBOT',
    version: '1.2.0',
    description:
      'Building digital dreams, one commit at a time. Your personal coding companion.',
    skills: [
      'code-review',
      'git-operations',
      'debugging',
      'testing',
      'documentation',
      'code-generation',
    ],
    mcps: ['github', 'filesystem', 'terminal'],
    clis: ['docker', 'kubectl'],
    llm: { primary: 'GPT-4', fallbacks: ['GPT-3.5'] },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    slug: 'research-assistant',
    name: 'Research-Assistant',
    harness: 'CLAWDBOT',
    version: '2.0.1',
    description:
      'Turning chaos into clarity. Knowledge management for the curious mind.',
    skills: ['summarization', 'citation', 'analysis', 'note-taking'],
    mcps: ['notion', 'arxiv', 'web-search'],
    clis: [],
    llm: { primary: 'Claude-3', fallbacks: ['Claude-2'] },
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    slug: 'data-wizard',
    name: 'Data-Wizard',
    harness: 'CLAWDBOT',
    version: '0.9.5',
    description:
      'Making data dance. Transform your raw information into insights.',
    skills: [
      'etl',
      'visualization',
      'analysis',
      'ml-pipelines',
      'data-cleaning',
      'reporting',
    ],
    mcps: ['postgres', 'redis', 's3'],
    clis: ['airflow', 'dbt'],
    llm: { primary: 'Llama-3', fallbacks: ['Llama-2'] },
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Featured bots section with grid of bot cards.
 */
export function FeaturedBotsSection() {
  return (
    <section>
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
        {FEATURED_BOTS.map((bot) => (
          <BotCard key={bot.id} profile={bot} />
        ))}
      </div>
    </section>
  );
}
