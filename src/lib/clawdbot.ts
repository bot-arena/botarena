import {
  safeReadFile,
  discoverFiles,
  DiscoveryResult,
  extractNameFromSoul,
  extractAvatarFromSoul,
  DiscoveredFile,
} from './discovery.js';
import { validatePublicConfig } from '../schemas/bot-config.js';
import type { PublicBotConfigType } from '../schemas/bot-config.js';
import * as path from 'path';

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
];

/**
 * ClawdBot Discovery Class
 * 
 * Discovers bot configuration by reading safe public files only.
 * Never accesses sensitive configuration files.
 */
export class ClawdBotDiscovery {
  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.basePath = path.resolve(basePath);
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
    const publicConfig = {
      name: discovery.name || 'Unnamed Bot',
      description: userDescription || 'A helpful AI assistant',
      llm: {
        primary: 'Not specified',
        fallbacks: [],
      },
      skills: discovery.skills || [],
      mcps: [],
      clis: [],
      harness: 'ClawdBot',
      version: '1.0.0',
    };

    // Validate against schema - this ensures only safe fields are included
    return validatePublicConfig(publicConfig);
  }

  /**
   * Discover skills from skills directories
   * Only reads directory names, never skill configuration files
   */
  private async discoverSkills(): Promise<string[]> {
    const skills: string[] = [];
    
    for (const skillDir of SKILL_DIRECTORIES) {
      const fullPath = path.join(this.basePath, skillDir);
      try {
        const entries = await discoverFiles(fullPath, ['*']);
        for (const entry of entries) {
          // Extract skill name from directory
          const skillName = path.basename(entry);
          // Filter out hidden files and test directories
          if (!skillName.startsWith('.') && 
              !skillName.includes('test') && 
              !skillName.includes('node_modules')) {
            skills.push(skillName);
          }
        }
      } catch {
        // Directory doesn't exist, skip
      }
    }
    
    // Deduplicate and sort
    return [...new Set(skills)].sort();
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
      const fullPath = path.join(this.basePath, skillDir);
      try {
        const entries = await discoverFiles(fullPath, ['*']);
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
