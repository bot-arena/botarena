import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * SECURITY NOTICE: File Discovery Utilities
 * 
 * These utilities implement strict security boundaries:
 * - Only read explicitly allowed files (SOUL.md, skills/, etc.)
 * - Never read files containing secrets (.env, config.json, etc.)
 * - Validate file paths to prevent directory traversal attacks
 * - Limit file size to prevent memory exhaustion attacks
 */

export interface DiscoveredFile {
  path: string;
  content: string;
  type: 'markdown' | 'json' | 'yaml' | 'text';
}

export interface DiscoveryResult {
  runtime: string;
  detectedFrom: string;
  files: DiscoveredFile[];
  name: string | undefined;
  avatar: string | undefined;
  skills: string[] | undefined;
}

// Maximum file size to read (1MB to prevent memory issues)
const MAX_FILE_SIZE = 1024 * 1024;

// List of sensitive file patterns to NEVER read
const SENSITIVE_FILE_PATTERNS = [
  '.env',
  '.env.',
  'config.json',
  'secrets',
  'private',
  'credentials',
  'token',
  'apikey',
  'password',
];

/**
 * Validates that a file path is safe to read
 * - Prevents directory traversal (../)
 * - Blocks access to sensitive file patterns
 * - Ensures path stays within base directory
 */
function isSafeFilePath(basePath: string, filePath: string): boolean {
  // Resolve to absolute paths
  const resolvedBase = path.resolve(basePath);
  const resolvedFile = path.resolve(basePath, filePath);
  
  // Check for directory traversal - file must be within base directory
  if (!resolvedFile.startsWith(resolvedBase)) {
    return false;
  }
  
  // Check against sensitive file patterns
  const normalizedPath = filePath.toLowerCase();
  for (const pattern of SENSITIVE_FILE_PATTERNS) {
    if (normalizedPath.includes(pattern.toLowerCase())) {
      return false;
    }
  }
  
  return true;
}

/**
 * Safely read a file if it exists
 * Returns null if file doesn't exist or can't be read
 */
export async function safeReadFile(filePath: string): Promise<string | null> {
  try {
    // Check file size first
    const stats = await fs.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      console.warn(`File too large, skipping: ${filePath}`);
      return null;
    }
    
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Discover files in a directory matching patterns
 * Only discovers files, never reads content unless explicitly requested
 */
export async function discoverFiles(
  basePath: string, 
  patterns: string[]
): Promise<string[]> {
  const results: string[] = [];
  
  for (const pattern of patterns) {
    // Validate path is safe before accessing
    if (!isSafeFilePath(basePath, pattern)) {
      console.warn(`Skipping unsafe path pattern: ${pattern}`);
      continue;
    }
    
    const fullPath = path.join(basePath, pattern);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.isFile()) {
        results.push(fullPath);
      } else if (stat.isDirectory()) {
        const entries = await fs.readdir(fullPath);
        for (const entry of entries) {
          const entryPath = path.join(pattern, entry);
          if (isSafeFilePath(basePath, entryPath)) {
            results.push(path.join(basePath, entryPath));
          }
        }
      }
    } catch {
      // Path doesn't exist, skip silently
    }
  }
  
  return results;
}

/**
 * Parse markdown frontmatter (YAML-style --- delimited)
 * Returns empty object if no frontmatter found
 */
export function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontmatter: Record<string, string> = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (key && value) {
        frontmatter[key] = value;
      }
    }
  }
  
  return frontmatter;
}

/**
 * Extract name from SOUL.md content
 * Looks for frontmatter first, then "Name:" in content
 */
export function extractNameFromSoul(content: string): string | undefined {
  const frontmatter = parseFrontmatter(content);
  if (frontmatter.name) return frontmatter.name;
  
  // Fallback: look for "Name:" in content
  const match = content.match(/Name:\s*(.+)/i);
  return match?.[1]?.trim();
}

/**
 * Extract avatar from SOUL.md content
 * Looks for frontmatter first, then "Avatar:" in content
 */
export function extractAvatarFromSoul(content: string): string | undefined {
  const frontmatter = parseFrontmatter(content);
  if (frontmatter.avatar) return frontmatter.avatar;
  
  // Fallback: look for "Avatar:" in content
  const match = content.match(/Avatar:\s*(.+)/i);
  return match?.[1]?.trim();
}

/**
 * Extract description from SOUL.md content
 * Looks for frontmatter first, then first paragraph
 */
export function extractDescriptionFromSoul(content: string): string | undefined {
  const frontmatter = parseFrontmatter(content);
  if (frontmatter.description) return frontmatter.description;
  
  // Fallback: extract first non-empty paragraph after frontmatter
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---/, '').trim();
  const paragraphs = contentWithoutFrontmatter.split('\n\n');
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      return trimmed.substring(0, 200); // Limit to 200 chars
    }
  }
  
  return undefined;
}

/**
 * Get file type based on extension
 */
export function getFileType(filePath: string): DiscoveredFile['type'] {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.md':
    case '.markdown':
      return 'markdown';
    case '.json':
      return 'json';
    case '.yaml':
    case '.yml':
      return 'yaml';
    default:
      return 'text';
  }
}
