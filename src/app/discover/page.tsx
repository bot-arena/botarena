'use client';

import * as React from 'react';
import { FilterTag } from '@/components/FilterTag';
import { BotCard, BotCardProfile } from '@/components/BotCard';
import { countActiveFilters } from '@/lib/utils';

// Types

interface Filters {
  search: string;
  harness: string;
  sortBy: string;
}

const HARNESS_OPTIONS = ['ALL', 'CLAWDBOT', 'CLAUDE', 'PI'] as const;

// Mock data - in real app, this would come from an API
const MOCK_BOTS: BotCardProfile[] = [
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

// Sub-components

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: SearchInputProps) {
  const inputId = React.useId();

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="text-xs uppercase text-[var(--color-text-secondary)] mb-1 block"
      >
        SEARCH_QUERY
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SEARCH_BOT_NAMES..."
        className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border-strong)] px-3 py-2 text-xs text-[var(--color-bg-panel)]"
      />
    </div>
  );
}

interface HarnessFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function HarnessFilter({ value, onChange }: HarnessFilterProps) {
  const labelId = React.useId();

  return (
    <div className="mb-4">
      <div
        id={labelId}
        className="text-xs uppercase text-[var(--color-text-secondary)] mb-2"
      >
        HARNESS_TYPE
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={labelId}>
        {HARNESS_OPTIONS.map((harness) => (
          <FilterTag
            key={harness}
            active={value === harness.toLowerCase()}
            onClick={() => onChange(harness.toLowerCase())}
          >
            {harness}
          </FilterTag>
        ))}
      </div>
    </div>
  );
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function SortSelect({ value, onChange }: SortSelectProps) {
  const selectId = React.useId();

  return (
    <div>
      <label
        htmlFor={selectId}
        className="text-xs uppercase text-[var(--color-text-secondary)] mb-1 block"
      >
        SORT_ORDER
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--color-bg-panel)] border border-[var(--color-border-strong)] px-3 py-2 text-xs font-bold"
      >
        <option value="updated">UPDATED_DESC</option>
        <option value="name">NAME_ASC</option>
        <option value="skills">SKILLS_COUNT_DESC</option>
      </select>
    </div>
  );
}

// Main page component

/**
 * Discover page for browsing and filtering bot profiles.
 * Includes search, harness filter, and sorting options.
 */
export default function DiscoverPage() {
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    harness: 'all',
    sortBy: 'updated',
  });

  // Filter bots based on current filters
  const filteredBots = React.useMemo(() => {
    return MOCK_BOTS.filter((bot) => {
      if (
        filters.search &&
        !bot.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.harness !== 'all' &&
        bot.harness.toLowerCase() !== filters.harness
      ) {
        return false;
      }
      return true;
    });
  }, [filters.search, filters.harness]);

  const activeFiltersCount = React.useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  // Handlers
  const handleSearchChange = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleHarnessChange = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, harness: value }));
  }, []);

  const handleSortChange = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <section className="retro-card mb-6">
        <h2 className="text-sm font-bold uppercase mb-4">FILTER_PARAMETERS</h2>

        <SearchInput value={filters.search} onChange={handleSearchChange} />
        <HarnessFilter
          value={filters.harness}
          onChange={handleHarnessChange}
        />
        <SortSelect value={filters.sortBy} onChange={handleSortChange} />
      </section>

      <div className="flex justify-between items-center mb-4">
        <span className="text-xs uppercase">RESULTS: {filteredBots.length}</span>
        <span className="text-xs text-[var(--color-text-secondary)]">
          FILTERS_ACTIVE: {activeFiltersCount}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBots.map((bot) => (
          <BotCard key={bot.id} profile={bot} />
        ))}
      </div>
    </div>
  );
}
