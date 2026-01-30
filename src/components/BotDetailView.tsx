'use client';

import { useState } from 'react';
import { ConfigSection } from '@/components/ConfigSection';
import { ConfigField } from '@/components/ConfigField';
import { getBotIcon, calculateRarity, getRarityColor, formatFullDate, cn } from '@/lib/utils';
import Link from 'next/link';

interface BotDetailProps {
  profile: {
    id?: string;
    slug?: string;
    name: string;
    harness: string;
    version: string;
    description: string;
    skills: Array<{ name: string; description: string }> | string[];
    mcps: Array<{ name: string; version?: string }> | string[];
    clis?: Array<{ name: string }> | string[];
    llm: {
      primary: string;
      fallbacks?: string[];
      temperature?: number;
      maxTokens?: number;
    };
    createdAt: Date | string;
    updatedAt: Date | string;
  };
}

export function BotDetailView({ profile }: BotDetailProps) {
  const [debugMode, setDebugMode] = useState(false);
  
  const skillsData = Array.isArray(profile.skills) 
    ? profile.skills 
    : profile.skills.map((s: string) => ({ name: s, description: '' }));
  const mcpsData = Array.isArray(profile.mcps) 
    ? profile.mcps 
    : profile.mcps.map((m: string) => ({ name: m, version: '' }));
  const clisData = Array.isArray(profile.clis) 
    ? profile.clis 
    : (profile.clis || []).map((c: string) => ({ name: c }));
  
  const skillsList = skillsData.map((s: any) => s.name);
  const mcpsList = mcpsData.map((m: any) => m.name);
  
  const rarity = calculateRarity(skillsList, mcpsList);
  const rarityColor = getRarityColor(rarity);
  const icon = getBotIcon(profile.llm.primary);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <section className="retro-card">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="w-full aspect-square bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] flex items-center justify-center mb-2">
              <span className="text-[48px]">{icon}</span>
            </div>
            <div className="text-center">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">RANK</div>
              <div className={cn('text-[14px] font-bold', rarityColor)}>
                {rarity}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-[24px] font-bold uppercase mb-2">{profile.name}</h1>

            <div className="grid grid-cols-2 gap-4 text-[10px] mb-4">
              <div>
                <div className="uppercase text-[var(--color-text-secondary)]">HARNESS</div>
                <div className="font-bold">{profile.harness}</div>
              </div>
              <div>
                <div className="uppercase text-[var(--color-text-secondary)]">VERSION</div>
                <div className="font-bold">v{profile.version}</div>
              </div>
              <div>
                <div className="uppercase text-[var(--color-text-secondary)]">CREATED</div>
                <div className="font-bold">{formatFullDate(profile.createdAt)}</div>
              </div>
              <div>
                <div className="uppercase text-[var(--color-text-secondary)]">UPDATED</div>
                <div className="font-bold">{formatFullDate(profile.updatedAt)}</div>
              </div>
            </div>

            <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] mb-4">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">YEARBOOK_QUOTE</div>
              <p className="text-[12px] italic">"{profile.description}"</p>
            </div>

            <div className="mb-4">
              <div className="text-[9px] uppercase text-[var(--color-text-secondary)] mb-1">PUBLIC_URL</div>
              <div className="flex gap-2">
                <input 
                  readOnly
                  value={`https://botarena.sh/bots/${profile.slug}`}
                  className="flex-1 bg-[var(--color-bg-dark)] border border-[var(--color-border-strong)] px-3 py-2 text-[10px] text-[var(--color-accent-code)] font-mono"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(`https://botarena.sh/bots/${profile.slug}`)}
                  className="px-4 py-2 bg-[var(--color-accent-primary)] text-[var(--color-bg-panel)] uppercase text-[10px] font-bold border border-[var(--color-border-strong)]"
                >
                  COPY
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                id="debug-mode" 
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                className="w-4 h-4 border border-[var(--color-border-strong)]"
              />
              <label htmlFor="debug-mode" className="text-[10px] uppercase font-bold">
                DEBUG_MODE
              </label>
            </div>
          </div>
        </div>
      </section>

      <ConfigSection title="LLM_CONFIG" expanded={true}>
        <div className="space-y-3">
          <ConfigField label="PRIMARY_MODEL" value={profile.llm.primary} />
          <ConfigField label="FALLBACK_MODELS" value={profile.llm.fallbacks || []} />
          <ConfigField label="TEMPERATURE" value={profile.llm.temperature || 'N/A'} />
          <ConfigField label="MAX_TOKENS" value={profile.llm.maxTokens || 'N/A'} />
        </div>
      </ConfigSection>

      <ConfigSection title="SKILLS" expanded={true}>
        <div className="grid grid-cols-2 gap-2">
          {skillsData.map((skill: any, idx: number) => (
            <div key={idx} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] p-2">
              <div className="font-bold text-[10px]">{skill.name}</div>
              {skill.description && (
                <div className="text-[9px] text-[var(--color-text-secondary)]">{skill.description}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-[9px] text-[var(--color-text-secondary)]">
          TOTAL_SKILLS: {skillsData.length}
        </div>
      </ConfigSection>

      <ConfigSection title="MCP_SERVERS" expanded={true}>
        <div className="space-y-2">
          {mcpsData.map((mcp: any, idx: number) => (
            <div key={idx} className="flex justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] p-2">
              <span className="text-[10px] font-bold">{mcp.name}</span>
              <span className="text-[9px] text-[var(--color-text-secondary)]">{mcp.version || 'UNKNOWN'}</span>
            </div>
          ))}
        </div>
      </ConfigSection>

      {clisData.length > 0 && (
        <ConfigSection title="CLI_TOOLS" expanded={true}>
          <div className="grid grid-cols-3 gap-2">
            {clisData.map((cli: any, idx: number) => (
              <div key={idx} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] p-2 text-center">
                <div className="text-[10px] font-bold">{cli.name}</div>
              </div>
            ))}
          </div>
        </ConfigSection>
      )}

      {debugMode && (
        <ConfigSection title="RAW_CONFIG" expanded={true}>
          <pre className="code-block overflow-x-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </ConfigSection>
      )}

      <section>
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href={`/compare?base=${profile.slug}`}
            className="retro-card text-center py-3 font-bold uppercase hover:bg-[var(--color-accent-primary)] hover:text-white"
          >
            ADD_TO_COMPARISON
          </Link>
          <a 
            href={`https://github.com/search?q=${encodeURIComponent(profile.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-card text-center py-3 font-bold uppercase hover:bg-[var(--color-accent-secondary)] hover:text-white"
          >
            FIND_ON_GITHUB
          </a>
        </div>
      </section>
    </div>
  );
}
