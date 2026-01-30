import {
  safeReadFile,
  DiscoveryResult,
  extractNameFromSoul,
  extractAvatarFromSoul,
  DiscoveredFile,
} from './discovery.js';
import { validatePublicConfig } from '../schemas/bot-config.js';
import type { PublicBotConfigType } from '../schemas/bot-config.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';

/**
 * SECURITY NOTICE: ClawdBot Discovery
 * 
 * This module implements the "Ask the Bot" security pattern:
 * - Only reads public/safe files (SOUL.md, skills documentation)
 * - Never accesses sensitive configuration files or API keys
 * - User provides description interactively (not auto-extracted from config)
 * - All extracted data is validated against PublicBotConfig schema
 */

// Directories to scan for skills
const SKILL_DIRECTORIES = [
  'skills',
  '.clawdbot/skills',
  '.claude/skills',
  '.pi/skills',
  '~/.pi/agent/skills',
  'src/skills',
  'lib/skills',
  'agents/skills',
];

/**
 * ClawdBot Discovery Class
 * 
 * Discovers bot configuration by reading safe public files only.
 * Never accesses sensitive configuration files.
 */
export class ClawdBotDiscovery {
  private basePath: string;
  private skillsPath: string | undefined;

  constructor(basePath: string = process.cwd(), skillsPath?: string) {
    this.basePath = path.resolve(basePath);
    this.skillsPath = skillsPath ? path.resolve(basePath, skillsPath) : undefined;
  }

  /**
   * Discover ClawdBot configuration from safe files
   * Returns discovery result with metadata and discovered files
   */
  async discover(): Promise<DiscoveryResult> {
    const result: DiscoveryResult = {
      runtime: 'ClawdBot',
      detectedFrom: this.basePath,
      files: [],
      skills: [],
      name: undefined,
      avatar: undefined,
    };

    // Read SOUL.md for identity
    const soulPath = path.join(this.basePath, 'SOUL.md');
    const soulContent = await safeReadFile(soulPath);
    if (soulContent) {
      result.name = extractNameFromSoul(soulContent);
      result.avatar = extractAvatarFromSoul(soulContent);
      result.files.push({
        path: 'SOUL.md',
        content: soulContent,
        type: 'markdown',
      });
    }

    // Read IDENTITY.md as fallback for name
    if (!result.name) {
      const identityPath = path.join(this.basePath, 'IDENTITY.md');
      const identityContent = await safeReadFile(identityPath);
      if (identityContent) {
        result.name = extractNameFromSoul(identityContent);
        result.files.push({
          path: 'IDENTITY.md',
          content: identityContent,
          type: 'markdown',
        });
      }
    }

    // Discover skills from skills directories
    const skills = await this.discoverSkills();
    result.skills = skills;

    // Discover MCP servers from mcp.json
    const mcps = await this.discoverMCPs();
    if (mcps.length > 0) {
      result.files.push({
        path: 'mcp.json',
        content: JSON.stringify({ servers: mcps }, null, 2),
        type: 'json',
      });
    }

    return result;
  }

  /**
   * Extract public configuration from discovered files
   * User provides description interactively - never auto-extracted from sensitive files
   */
  async extractPublicConfig(userDescription?: string): Promise<PublicBotConfigType> {
    const discovery = await this.discover();

    // Build public config from discovered files + user input
    // SECURITY: User provides description interactively, we never extract from config files
    const mcps = await this.discoverMCPs();
    const publicConfig = {
      name: discovery.name || 'Unnamed Bot',
      description: userDescription || 'A helpful AI assistant',
      llm: {
        primary: 'Not specified',
        fallbacks: [],
      },
      skills: discovery.skills || [],
      mcps: mcps,
      clis: [],
      harness: 'ClawdBot',
      version: '1.0.0',
    };

    // Validate against schema - this ensures only safe fields are included
    return validatePublicConfig(publicConfig);
  }

  /**
   * Discover skills from skills directories
   * Supports recursive search and custom skills path
   * Only reads directory names, never skill configuration files
   */
  private async discoverSkills(): Promise<string[]> {
    const skills: string[] = [];
    const directoriesToScan: string[] = [];

    // If custom skills path provided, scan it recursively
    if (this.skillsPath) {
      const customSkills = await this.scanSkillsRecursively(this.skillsPath);
      skills.push(...customSkills);
    }

    // Also scan standard skill directories
    for (const skillDir of SKILL_DIRECTORIES) {
      // Expand ~ to home directory for absolute paths
      const expandedPath = skillDir.startsWith('~/')
        ? path.join(os.homedir(), skillDir.slice(2))
        : skillDir;
      const fullPath = path.isAbsolute(expandedPath)
        ? expandedPath
        : path.join(this.basePath, expandedPath);
      directoriesToScan.push(fullPath);
    }

    // Scan all directories (both standard and discovered)
    for (const fullPath of directoriesToScan) {
      try {
        // Scan this directory recursively for skills
        const discoveredSkills = await this.scanSkillsRecursively(fullPath);
        skills.push(...discoveredSkills);
      } catch {
        // Directory doesn't exist, skip
      }
    }

    // Deduplicate and sort
    return [...new Set(skills)].sort();
  }

  /**
   * Recursively scan a directory for skills
   * Looks for skill directories containing skill.md, README.md, or package.json
   */
  private async scanSkillsRecursively(dirPath: string, depth: number = 0): Promise<string[]> {
    const skills: string[] = [];
    const MAX_DEPTH = 3; // Prevent infinite recursion

    if (depth > MAX_DEPTH) {
      return skills;
    }

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const entryName = entry.name;
        const entryPath = path.join(dirPath, entryName);

        // Filter out hidden files and test directories
        if (entryName.startsWith('.') ||
            entryName.includes('test') ||
            entryName.includes('node_modules') ||
            entryName.includes('__tests__') ||
            entryName.includes('dist') ||
            entryName.includes('build')) {
          continue;
        }

        // Check if this directory is a skill root (contains skill.md, README.md, or package.json)
        const isSkillRoot = await this.isSkillRoot(entryPath);

        if (isSkillRoot) {
          // Extract skill name from package.json if available, otherwise use directory name
          const skillName = await this.extractSkillName(entryPath, entryName);
          skills.push(skillName);
        } else {
          // Recursively search subdirectories
          const subSkills = await this.scanSkillsRecursively(entryPath, depth + 1);
          skills.push(...subSkills);
        }
      }
    } catch {
      // Directory doesn't exist or can't be read, skip
    }

    return skills;
  }

  /**
   * Check if a directory is a skill root by looking for marker files
   */
  private async isSkillRoot(dirPath: string): Promise<boolean> {
    const markerFiles = ['skill.md', 'README.md', 'package.json', 'skill.json'];

    for (const marker of markerFiles) {
      try {
        const markerPath = path.join(dirPath, marker);
        await fs.access(markerPath);
        return true;
      } catch {
        // File doesn't exist, continue checking
      }
    }

    return false;
  }

  /**
   * Extract skill name from directory
   * Tries package.json name field first, falls back to directory name
   */
  private async extractSkillName(dirPath: string, dirName: string): Promise<string> {
    try {
      const packageJsonPath = path.join(dirPath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.name) {
        return pkg.name;
      }
    } catch {
      // package.json doesn't exist or is invalid, use directory name
    }

    return dirName;
  }

  /**
   * Discover MCP servers from mcp.json
   * Only extracts server names, never reads sensitive configuration
   */
  private async discoverMCPs(): Promise<string[]> {
    const mcps: string[] = [];
    const mcpPath = path.join(this.basePath, 'mcp.json');
    
    try {
      const content = await safeReadFile(mcpPath);
      if (content) {
        const config = JSON.parse(content);
        // Extract only server names, not their configuration
        if (config.mcpServers && typeof config.mcpServers === 'object') {
          mcps.push(...Object.keys(config.mcpServers));
        } else if (config.servers && Array.isArray(config.servers)) {
          mcps.push(...config.servers.map((s: any) => s.name || s));
        }
      }
    } catch {
      // mcp.json doesn't exist or is invalid, skip
    }
    
    return mcps;
  }

  /**
   * Check if this directory contains a ClawdBot instance
   * Looks for SOUL.md or skills directory as indicators
   */
  async isClawdBot(): Promise<boolean> {
    // Check for SOUL.md
    const soulPath = path.join(this.basePath, 'SOUL.md');
    const soulExists = await safeReadFile(soulPath);
    if (soulExists !== null) {
      return true;
    }

    // Check for IDENTITY.md (alternative)
    const identityPath = path.join(this.basePath, 'IDENTITY.md');
    const identityExists = await safeReadFile(identityPath);
    if (identityExists !== null) {
      return true;
    }

    // Check for skills directory with content
    for (const skillDir of SKILL_DIRECTORIES) {
      // Expand ~ to home directory for absolute paths
      const expandedPath = skillDir.startsWith('~/')
        ? path.join(os.homedir(), skillDir.slice(2))
        : skillDir;
      const fullPath = path.isAbsolute(expandedPath)
        ? expandedPath
        : path.join(this.basePath, expandedPath);
      try {
        const entries = await fs.readdir(fullPath);
        if (entries.length > 0) {
          return true;
        }
      } catch {
        // Directory doesn't exist
      }
    }

    return false;
  }

  /**
   * Get discovered files for inspection
   * Returns list of files that were safely read
   */
  async getDiscoveredFiles(): Promise<DiscoveredFile[]> {
    const discovery = await this.discover();
    return discovery.files;
  }
}

/**
 * Factory function to create appropriate discovery instance
 * Currently only supports ClawdBot, but extensible for other runtimes
 */
export async function createDiscovery(
  basePath: string = process.cwd()
): Promise<ClawdBotDiscovery | null> {
  const clawdBotDiscovery = new ClawdBotDiscovery(basePath);
  
  if (await clawdBotDiscovery.isClawdBot()) {
    return clawdBotDiscovery;
  }
  
  return null;
}
