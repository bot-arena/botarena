'use client';

import * as React from 'react';
import Link from 'next/link';
import { ConfigSection } from '@/components/ConfigSection';
import { ConfigField } from '@/components/ConfigField';
import {
  getBotIcon,
  calculateRarity,
  getRarityColor,
  formatFullDate,
  cn,
} from '@/lib/utils';
import { BotDetailViewProps } from './types';
import { normalizeSkills, normalizeMcps, normalizeClis } from './utils';
import { InfoItem } from './InfoItem';
import { CopyableUrl } from './CopyableUrl';
import { DebugToggle } from './DebugToggle';
import { SkillCard } from './SkillCard';
import { McpRow } from './McpRow';

/**
 * Detailed view component for displaying bot profile information.
 * Shows avatar, stats, configuration, skills, MCPs, CLIs, and raw config.
 */
export function BotDetailView({ profile }: BotDetailViewProps) {
  const [debugMode, setDebugMode] = React.useState(false);

  // Normalize data
  const skillsData = React.useMemo(
    () => normalizeSkills(profile.skills),
    [profile.skills]
  );
  const mcpsData = React.useMemo(() => normalizeMcps(profile.mcps), [profile.mcps]);
  const clisData = React.useMemo(
    () => normalizeClis(profile.clis),
    [profile.clis]
  );

  // Calculate derived values
  const rarity = React.useMemo(
    () => calculateRarity(skillsData.map((s) => s.name), mcpsData.map((m) => m.name)),
    [skillsData, mcpsData]
  );
  const rarityColor = getRarityColor(rarity);
  const icon = getBotIcon(profile.llm.primary);

  // Construct public URL
  const publicUrl = profile.slug
    ? `https://botarena.sh/bots/${profile.slug}`
    : '';

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <section className="retro-card">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-full aspect-square bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] flex items-center justify-center mb-2">
              <span className="text-5xl" aria-hidden="true">
                {icon}
              </span>
            </div>
            <div className="text-center">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">
                RANK
              </div>
              <div className={cn('text-sm font-bold', rarityColor)}>{rarity}</div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold uppercase">{profile.name}</h1>

            <div className="grid grid-cols-2 gap-4 text-[10px]">
              <InfoItem label="HARNESS" value={profile.harness} />
              <InfoItem label="VERSION" value={`v${profile.version}`} />
              <InfoItem label="CREATED" value={formatFullDate(profile.createdAt)} />
              <InfoItem label="UPDATED" value={formatFullDate(profile.updatedAt)} />
            </div>

            <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)]">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">
                YEARBOOK_QUOTE
              </div>
              <p className="text-xs italic">&ldquo;{profile.description}&rdquo;</p>
            </div>

            {publicUrl && (
              <div>
                <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">
                  PUBLIC_URL
                </div>
                <CopyableUrl url={publicUrl} />
              </div>
            )}

            <DebugToggle enabled={debugMode} onChange={setDebugMode} />
          </div>
        </div>
      </section>

      <ConfigSection title="LLM_CONFIG" expanded={true}>
        <div className="space-y-3">
          <ConfigField label="PRIMARY_MODEL" value={profile.llm.primary} />
          <ConfigField
            label="FALLBACK_MODELS"
            value={profile.llm.fallbacks ?? []}
          />
          <ConfigField
            label="TEMPERATURE"
            value={profile.llm.temperature ?? 'N/A'}
          />
          <ConfigField label="MAX_TOKENS" value={profile.llm.maxTokens ?? 'N/A'} />
        </div>
      </ConfigSection>

      <ConfigSection title="SKILLS" expanded={true}>
        <div className="grid grid-cols-2 gap-2">
          {skillsData.map((skill, index) => (
            <SkillCard key={`${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
        <div className="mt-2 text-[9px] text-[var(--color-text-secondary)]">
          TOTAL_SKILLS: {skillsData.length}
        </div>
      </ConfigSection>

      <ConfigSection title="MCP_SERVERS" expanded={true}>
        <div className="space-y-2">
          {mcpsData.map((mcp, index) => (
            <McpRow key={`${mcp.name}-${index}`} mcp={mcp} />
          ))}
        </div>
      </ConfigSection>

      {clisData.length > 0 && (
        <ConfigSection title="CLI_TOOLS" expanded={true}>
          <div className="grid grid-cols-3 gap-2">
            {clisData.map((cli, index) => (
              <div
                key={`${cli.name}-${index}`}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] p-2 text-center"
              >
                <div className="text-[10px] font-bold">{cli.name}</div>
              </div>
            ))}
          </div>
        </ConfigSection>
      )}

      {debugMode && (
        <ConfigSection title="RAW_CONFIG" expanded={true}>
          <pre className="code-block overflow-x-auto text-xs">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </ConfigSection>
      )}

      <section>
        <div className="grid grid-cols-2 gap-4">
          {profile.slug && (
            <Link
              href={`/compare?base=${profile.slug}`}
              className="retro-card text-center py-3 font-bold uppercase hover:bg-[var(--color-accent-primary)] hover:text-white transition-colors"
            >
              ADD_TO_COMPARISON
            </Link>
          )}
          <a
            href={`https://github.com/search?q=${encodeURIComponent(profile.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-card text-center py-3 font-bold uppercase hover:bg-[var(--color-accent-secondary)] hover:text-white transition-colors"
          >
            FIND_ON_GITHUB
          </a>
        </div>
      </section>
    </div>
  );
}

// Re-export types
export type {
  BotDetailViewProps,
  Skill,
  Mcp,
  Cli,
  LlmConfig,
  BotProfile,
} from './types';
