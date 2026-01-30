'use client';

import { calculateRarityScore } from '@/lib/utils';

interface Diff {
  field: string;
  change: 'added' | 'removed' | 'changed';
  baseValue: string | number;
  compareValue: string | number;
}

export default function ComparePage() {
  const baseBot = {
    id: '1',
    slug: 'devbot-v1',
    name: 'DevBot-V1',
    harness: 'CLAWDBOT',
    version: '1.2.0',
    description: 'Building digital dreams, one commit at a time.',
    skills: ['code-review', 'git-operations', 'debugging', 'testing', 'documentation', 'code-generation'],
    mcps: ['github', 'filesystem', 'terminal'],
    clis: ['docker', 'kubectl'],
    llm: { primary: 'GPT-4', fallbacks: ['GPT-3.5'], temperature: 0.7, maxTokens: 4096 },
  };

  const compareBot = {
    id: '2',
    slug: 'research-assistant',
    name: 'Research-Assistant',
    harness: 'CLAWDBOT',
    version: '2.0.1',
    description: 'Turning chaos into clarity.',
    skills: ['summarization', 'citation', 'analysis', 'note-taking'],
    mcps: ['notion', 'arxiv', 'web-search'],
    clis: [],
    llm: { primary: 'Claude-3', fallbacks: ['Claude-2'], temperature: 0.5, maxTokens: 8192 },
  };

  const diffs: Diff[] = [];

  if (baseBot.llm.primary !== compareBot.llm.primary) {
    diffs.push({
      field: 'PRIMARY_LLM',
      change: 'changed',
      baseValue: baseBot.llm.primary,
      compareValue: compareBot.llm.primary,
    });
  }

  const baseSkillsCount = baseBot.skills.length;
  const compareSkillsCount = compareBot.skills.length;
  if (baseSkillsCount !== compareSkillsCount) {
    diffs.push({
      field: 'SKILLS_COUNT',
      change: compareSkillsCount > baseSkillsCount ? 'added' : 'removed',
      baseValue: baseSkillsCount,
      compareValue: compareSkillsCount,
    });
  }

  const baseMcpsCount = baseBot.mcps.length;
  const compareMcpsCount = compareBot.mcps.length;
  if (baseMcpsCount !== compareMcpsCount) {
    diffs.push({
      field: 'MCPS_COUNT',
      change: compareMcpsCount > baseMcpsCount ? 'added' : 'removed',
      baseValue: baseMcpsCount,
      compareValue: compareMcpsCount,
    });
  }

  const baseClisCount = baseBot.clis?.length || 0;
  const compareClisCount = compareBot.clis?.length || 0;
  if (baseClisCount !== compareClisCount) {
    diffs.push({
      field: 'CLIS_COUNT',
      change: compareClisCount > baseClisCount ? 'added' : 'removed',
      baseValue: baseClisCount,
      compareValue: compareClisCount,
    });
  }

  function getDiffColor(change: Diff['change']): string {
    if (change === 'added') return 'text-[var(--color-accent-success)]';
    if (change === 'removed') return 'text-[var(--color-accent-critical)]';
    return 'text-[var(--color-accent-primary)]';
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[20px] font-bold uppercase mb-6">CONFIGURATION_COMPARISON</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div></div>
        <div className="retro-card text-center">
          <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">BASE_BOT</div>
          <div className="text-[14px] font-bold">{baseBot.name}</div>
        </div>
        <div className="retro-card text-center">
          <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">COMPARE_BOT</div>
          <div className="text-[14px] font-bold">{compareBot.name}</div>
        </div>
      </div>

      <section className="retro-card mb-4">
        <h2 className="text-[12px] font-bold uppercase mb-4 border-b border-[var(--color-border-strong)] pb-2">
          SIGNIFICANT_DIFFERENCES
        </h2>

        {diffs.length === 0 ? (
          <div className="text-[10px] text-[var(--color-text-secondary)] text-center py-4">
            NO_SIGNIFICANT_DIFFERENCES_DETECTED
          </div>
        ) : (
          diffs.map((diff, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2 border-b border-[var(--color-border-weak)] last:border-0">
              <div className="w-1/3 text-[10px] uppercase text-[var(--color-text-secondary)]">{diff.field}</div>
              <div className="w-1/3 text-[10px]">{diff.baseValue}</div>
              <div className={`w-1/3 text-[10px] font-bold ${getDiffColor(diff.change)}`}>
                {diff.change === 'added' && '+'}
                {diff.change === 'removed' && '-'}
                {diff.compareValue}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="retro-card">
        <h2 className="text-[12px] font-bold uppercase mb-4 border-b border-[var(--color-border-strong)] pb-2">
          STATISTICS_COMPARISON
        </h2>

        <StatsCompare 
          label="SKILLS_COUNT" 
          base={baseSkillsCount} 
          compare={compareSkillsCount}
        />
        <StatsCompare 
          label="MCPS_COUNT" 
          base={baseMcpsCount} 
          compare={compareMcpsCount}
        />
        <StatsCompare 
          label="CLIS_COUNT" 
          base={baseClisCount} 
          compare={compareClisCount}
        />
        <StatsCompare 
          label="RARITY_SCORE" 
          base={calculateRarityScore(baseBot)} 
          compare={calculateRarityScore(compareBot)}
        />
      </section>
    </div>
  );
}

function StatsCompare({ label, base, compare }: { label: string, base: number, compare: number }) {
  const max = Math.max(base, compare);
  
  return (
    <div className="mb-4">
      <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="h-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] relative">
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--color-accent-primary)]"
              style={{ width: `${(base / max) * 100}%` }}
            />
            <span className="absolute top-1 right-2 text-[9px] font-bold">{base}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] relative">
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--color-accent-success)]"
              style={{ width: `${(compare / max) * 100}%` }}
            />
            <span className="absolute top-1 right-2 text-[9px] font-bold">{compare}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
