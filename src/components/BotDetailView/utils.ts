import { Skill, Mcp, Cli } from './types';

export function normalizeSkills(skills: Skill[] | string[]): Skill[] {
  if (!Array.isArray(skills)) return [];
  return skills.map((skill) =>
    typeof skill === 'string'
      ? { name: skill, description: '' }
      : { name: skill.name, description: skill.description || '' }
  );
}

export function normalizeMcps(mcps: Mcp[] | string[]): Mcp[] {
  if (!Array.isArray(mcps)) return [];
  return mcps.map((mcp) =>
    typeof mcp === 'string'
      ? { name: mcp, version: '' }
      : { name: mcp.name, version: mcp.version || '' }
  );
}

export function normalizeClis(clis: Cli[] | string[] | undefined): Cli[] {
  if (!clis || !Array.isArray(clis)) return [];
  return clis.map((cli) =>
    typeof cli === 'string' ? { name: cli } : { name: cli.name }
  );
}
