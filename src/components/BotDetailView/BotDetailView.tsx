'use client';

import * as React from 'react';
import { Panel } from '@/components/Panel';
import { ConfigSection } from '@/components/ConfigSection';
import { ConfigField } from '@/components/ConfigField';
import { getBotIcon, formatFullDate } from '@/lib/utils';
import { BotDetailViewProps } from './types';
import { normalizeSkills, normalizeMcps, normalizeClis } from './utils';
import { InfoItem } from './InfoItem';
import { CopyableUrl } from './CopyableUrl';
import { DebugToggle } from './DebugToggle';
import { SkillCard } from './SkillCard';
import { McpRow } from './McpRow';
import { CliBadge } from './CliBadge';
import { NoiseAvatar } from './NoiseAvatar';

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
  const llmPrimary = profile.llm?.primary ?? 'UNKNOWN';
  const llmFallbacks = profile.llm?.fallbacks ?? [];
  const icon = getBotIcon(llmPrimary);
  const createdAtLabel = profile.createdAt
    ? formatFullDate(profile.createdAt)
    : 'UNKNOWN';
  const updatedAtLabel = profile.updatedAt
    ? formatFullDate(profile.updatedAt)
    : 'UNKNOWN';

  // Construct public URL
  const publicUrl = profile.slug
    ? `https://botarena.sh/bots/${profile.slug}`
    : '';

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-4">
      <section className="retro-card">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Panel className="w-full aspect-square overflow-hidden mb-2">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${profile.name} avatar`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <NoiseAvatar icon={icon} model={llmPrimary} />
              )}
            </Panel>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold uppercase">{profile.name}</h1>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoItem label="HARNESS" value={profile.harness} />
              <InfoItem label="VERSION" value={`v${profile.version}`} />
              <InfoItem label="CREATED" value={createdAtLabel} />
              <InfoItem label="UPDATED" value={updatedAtLabel} />
            </div>

            <Panel className="p-3">
              <div className="text-xs uppercase text-[var(--color-text-secondary)] mb-1">
                YEARBOOK_QUOTE
              </div>
              <p className="text-sm italic">&ldquo;{profile.description}&rdquo;</p>
            </Panel>

            {publicUrl && (
              <div>
                <div className="text-xs uppercase text-[var(--color-text-secondary)] mb-1">
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
          <ConfigField label="PRIMARY_MODEL" value={llmPrimary} />
          <ConfigField
            label="FALLBACK_MODELS"
            value={llmFallbacks}
          />
        </div>
      </ConfigSection>

      <ConfigSection title="SKILLS" expanded={true}>
        <div className="badge-inline-container">
          {skillsData.map((skill, index) => (
            <SkillCard key={`${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
        <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
          TOTAL_SKILLS: {skillsData.length}
        </div>
      </ConfigSection>

      <ConfigSection title="MCP_SERVERS" expanded={true}>
        <div className="badge-inline-container">
          {mcpsData.map((mcp, index) => (
            <McpRow key={`${mcp.name}-${index}`} mcp={mcp} />
          ))}
        </div>
      </ConfigSection>

      {clisData.length > 0 && (
        <ConfigSection title="CLI_TOOLS" expanded={true}>
          <div className="badge-inline-container">
            {clisData.map((cli, index) => (
              <CliBadge
                key={`${typeof cli === 'string' ? cli : cli.name}-${index}`}
                cli={cli}
              />
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
