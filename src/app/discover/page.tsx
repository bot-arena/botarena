'use client';

import { useState } from 'react';
import { FilterTag } from '@/components/FilterTag';
import { BotCard } from '@/components/BotCard';
import { countActiveFilters } from '@/lib/utils';

export default function DiscoverPage() {
  const [filters, setFilters] = useState({
    search: '',
    harness: 'all',
    sortBy: 'updated'
  });
  
  const mockBots = [
    {
      id: '1',
      slug: 'devbot-v1',
      name: 'DevBot-V1',
      harness: 'CLAWDBOT',
      version: '1.2.0',
      description: 'Building digital dreams, one commit at a time.',
      skills: ['code-review', 'git-operations', 'debugging', 'testing', 'documentation', 'code-generation'],
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
      description: 'Turning chaos into clarity.',
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
      description: 'Making data dance.',
      skills: ['etl', 'visualization', 'analysis', 'ml-pipelines', 'data-cleaning', 'reporting'],
      mcps: ['postgres', 'redis', 's3'],
      clis: ['airflow', 'dbt'],
      llm: { primary: 'Llama-3', fallbacks: ['Llama-2'] },
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      slug: 'code-ninja',
      name: 'Code-Ninja',
      harness: 'CLAWDBOT',
      version: '0.8.0',
      description: 'Silent but deadly efficient coder.',
      skills: ['refactoring', 'optimization', 'code-generation'],
      mcps: ['github'],
      clis: ['git'],
      llm: { primary: 'Claude-3', fallbacks: [] },
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      slug: 'test-robot',
      name: 'Test-Robot',
      harness: 'CLAWDBOT',
      version: '1.5.0',
      description: 'Quality assurance automation beast.',
      skills: ['testing', 'mocking', 'coverage-analysis', 'ci-cd'],
      mcps: ['github', 'jenkins'],
      clis: ['docker'],
      llm: { primary: 'GPT-4', fallbacks: ['GPT-3.5'] },
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredBots = mockBots.filter(bot => {
    if (filters.search && !bot.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.harness !== 'all' && bot.harness.toLowerCase() !== filters.harness) {
      return false;
    }
    return true;
  });

  const activeFiltersCount = countActiveFilters(filters);

  return (
    <div className="max-w-7xl mx-auto">
      <section className="retro-card mb-6">
        <h2 className="text-[14px] font-bold uppercase mb-4">FILTER_PARAMETERS</h2>

        <div className="mb-4">
          <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">SEARCH_QUERY</div>
          <input 
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            placeholder="SEARCH_BOT_NAMES..."
            className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border-strong)] px-3 py-2 text-[10px] text-[var(--color-bg-panel)]"
          />
        </div>

        <div className="mb-4">
          <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-2">HARNESS_TYPE</div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'CLAWDBOT', 'CLAUDE', 'PI'].map((harness) => (
              <FilterTag
                key={harness}
                active={filters.harness === harness.toLowerCase()}
                onClick={() => setFilters({...filters, harness: harness.toLowerCase()})}
              >
                {harness}
              </FilterTag>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">SORT_ORDER</div>
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            className="w-full bg-[var(--color-bg-panel)] border border-[var(--color-border-strong)] px-3 py-2 text-[10px] font-bold"
          >
            <option value="updated">UPDATED_DESC</option>
            <option value="name">NAME_ASC</option>
            <option value="skills">SKILLS_COUNT_DESC</option>
          </select>
        </div>
      </section>

      <div className="flex justify-between items-center mb-4">
        <span className="text-[12px] uppercase">
          RESULTS: {filteredBots.length}
        </span>
        <span className="text-[10px] text-[var(--color-text-secondary)]">
          FILTERS_ACTIVE: {activeFiltersCount}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBots.map((bot, idx) => (
          <BotCard key={bot.id} profile={bot} index={idx} />
        ))}
      </div>
    </div>
  );
}
