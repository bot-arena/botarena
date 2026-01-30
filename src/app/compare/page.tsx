'use client';

import * as React from 'react';
import { calculateRarityScore, cn } from '@/lib/utils';

// Types

type ChangeType = 'added' | 'removed' | 'changed';

interface Diff {
  field: string;
  change: ChangeType;
  baseValue: string | number;
  compareValue: string | number;
}

interface BotConfig {
  id: string;
  slug: string;
  name: string;
  harness: string;
  version: string;
  description: string;
  skills: string[];
  mcps: string[];
  clis: string[];
  llm: {
    primary: string;
    fallbacks: string[];
    temperature?: number;
    maxTokens?: number;
  };
}

// Constants

const BASE_BOT: BotConfig = {
  id: '1',
  slug: 'devbot-v1',
  name: 'DevBot-V1',
  harness: 'CLAWDBOT',
  version: '1.2.0',
  description: 'Building digital dreams, one commit at a time.',
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
  llm: {
    primary: 'GPT-4',
    fallbacks: ['GPT-3.5'],
    temperature: 0.7,
    maxTokens: 4096,
  },
};

const COMPARE_BOT: BotConfig = {
  id: '2',
  slug: 'research-assistant',
  name: 'Research-Assistant',
  harness: 'CLAWDBOT',
  version: '2.0.1',
  description: 'Turning chaos into clarity.',
  skills: ['summarization', 'citation', 'analysis', 'note-taking'],
  mcps: ['notion', 'arxiv', 'web-search'],
  clis: [],
  llm: {
    primary: 'Claude-3',
    fallbacks: ['Claude-2'],
    temperature: 0.5,
    maxTokens: 8192,
  },
};

// Utilities

function getDiffColor(change: ChangeType): string {
  const colors: Record<ChangeType, string> = {
    added: 'text-[var(--color-accent-success)]',
    removed: 'text-[var(--color-accent-critical)]',
    changed: 'text-[var(--color-accent-primary)]',
  };
  return colors[change];
}

function calculateDiffs(base: BotConfig, compare: BotConfig): Diff[] {
  const diffs: Diff[] = [];

  // LLM comparison
  if (base.llm.primary !== compare.llm.primary) {
    diffs.push({
      field: 'PRIMARY_LLM',
      change: 'changed',
      baseValue: base.llm.primary,
      compareValue: compare.llm.primary,
    });
  }

  // Skills count
  if (base.skills.length !== compare.skills.length) {
    const isAdded = compare.skills.length > base.skills.length;
    diffs.push({
      field: 'SKILLS_COUNT',
      change: isAdded ? 'added' : 'removed',
      baseValue: base.skills.length,
      compareValue: compare.skills.length,
    });
  }

  // MCPs count
  if (base.mcps.length !== compare.mcps.length) {
    const isAdded = compare.mcps.length > base.mcps.length;
    diffs.push({
      field: 'MCPS_COUNT',
      change: isAdded ? 'added' : 'removed',
      baseValue: base.mcps.length,
      compareValue: compare.mcps.length,
    });
  }

  // CLIs count
  const baseClis = base.clis?.length ?? 0;
  const compareClis = compare.clis?.length ?? 0;
  if (baseClis !== compareClis) {
    const isAdded = compareClis > baseClis;
    diffs.push({
      field: 'CLIS_COUNT',
      change: isAdded ? 'added' : 'removed',
      baseValue: baseClis,
      compareValue: compareClis,
    });
  }

  return diffs;
}

// Sub-components

interface DiffRowProps {
  diff: Diff;
}

function DiffRow({ diff }: DiffRowProps) {
  const changePrefix =
    diff.change === 'added' ? '+' : diff.change === 'removed' ? '-' : '';

  return (
    <div className="flex items-center gap-4 py-2 border-b border-[var(--color-border-weak)] last:border-0">
      <div className="w-1/3 text-[10px] uppercase text-[var(--color-text-secondary)]">
        {diff.field}
      </div>
      <div className="w-1/3 text-[10px]">{diff.baseValue}</div>
      <div
        className={cn(
          'w-1/3 text-[10px] font-bold',
          getDiffColor(diff.change)
        )}
      >
        {changePrefix}
        {diff.compareValue}
      </div>
    </div>
  );
}

interface ComparisonHeaderProps {
  baseName: string;
  compareName: string;
}

function ComparisonHeader({ baseName, compareName }: ComparisonHeaderProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div />
      <div className="retro-card text-center">
        <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">
          BASE_BOT
        </div>
        <div className="text-sm font-bold">{baseName}</div>
      </div>
      <div className="retro-card text-center">
        <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">
          COMPARE_BOT
        </div>
        <div className="text-sm font-bold">{compareName}</div>
      </div>
    </div>
  );
}

interface StatsCompareProps {
  label: string;
  base: number;
  compare: number;
}

function StatsCompare({ label, base, compare }: StatsCompareProps) {
  const max = Math.max(base, compare, 1);
  const baseWidth = max > 0 ? (base / max) * 100 : 0;
  const compareWidth = max > 0 ? (compare / max) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="h-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] relative">
            <div
              className="absolute top-0 left-0 h-full bg-[var(--color-accent-primary)]"
              style={{ width: `${baseWidth}%` }}
            />
            <span className="absolute top-1 right-2 text-[9px] font-bold">{base}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] relative">
            <div
              className="absolute top-0 left-0 h-full bg-[var(--color-accent-success)]"
              style={{ width: `${compareWidth}%` }}
            />
            <span className="absolute top-1 right-2 text-[9px] font-bold">{compare}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component

/**
 * Compare page for side-by-side bot configuration comparison.
 * Shows differences in LLM, skills, MCPs, and CLIs.
 */
export default function ComparePage() {
  const diffs = React.useMemo(
    () => calculateDiffs(BASE_BOT, COMPARE_BOT),
    []
  );

  const baseStats = {
    skills: BASE_BOT.skills.length,
    mcps: BASE_BOT.mcps.length,
    clis: BASE_BOT.clis?.length ?? 0,
    rarity: calculateRarityScore(BASE_BOT),
  };

  const compareStats = {
    skills: COMPARE_BOT.skills.length,
    mcps: COMPARE_BOT.mcps.length,
    clis: COMPARE_BOT.clis?.length ?? 0,
    rarity: calculateRarityScore(COMPARE_BOT),
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold uppercase mb-6">
        CONFIGURATION_COMPARISON
      </h1>

      <ComparisonHeader
        baseName={BASE_BOT.name}
        compareName={COMPARE_BOT.name}
      />

      <section className="retro-card mb-4">
        <h2 className="text-xs font-bold uppercase mb-4 border-b border-[var(--color-border-strong)] pb-2">
          SIGNIFICANT_DIFFERENCES
        </h2>

        {diffs.length === 0 ? (
          <div className="text-[10px] text-[var(--color-text-secondary)] text-center py-4">
            NO_SIGNIFICANT_DIFFERENCES_DETECTED
          </div>
        ) : (
          diffs.map((diff) => <DiffRow key={diff.field} diff={diff} />)
        )}
      </section>

      <section className="retro-card">
        <h2 className="text-xs font-bold uppercase mb-4 border-b border-[var(--color-border-strong)] pb-2">
          STATISTICS_COMPARISON
        </h2>

        <StatsCompare
          label="SKILLS_COUNT"
          base={baseStats.skills}
          compare={compareStats.skills}
        />
        <StatsCompare
          label="MCPS_COUNT"
          base={baseStats.mcps}
          compare={compareStats.mcps}
        />
        <StatsCompare
          label="CLIS_COUNT"
          base={baseStats.clis}
          compare={compareStats.clis}
        />
        <StatsCompare
          label="RARITY_SCORE"
          base={baseStats.rarity}
          compare={compareStats.rarity}
        />
      </section>
    </div>
  );
}
