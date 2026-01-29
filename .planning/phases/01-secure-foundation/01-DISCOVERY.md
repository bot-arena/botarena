# Phase 1 Discovery: Secure Foundation

**Date:** 2026-01-28  
**Phase:** 1 - Secure Foundation  
**Discovery Level:** Level 2 (Standard Research)

## Key Findings

### 1. ClawdBot Runtime Integration Patterns

**Finding:** ClawdBot configuration includes public metadata files (SOUL.md, IDENTITY.md) alongside sensitive config files. Direct access to JSON config files is prohibited by security requirements.

**Secure Extraction Approach:**
- CLI reads public files: `SOUL.md`, `IDENTITY.md`, skill documentation
- Interactive prompts collect the bot's "yearbook quote" description from the user
- Skills are discovered by scanning the `skills/` directory
- Never reads `.env`, `config.json`, or other files containing secrets

**Implementation Pattern:**
```bash
# CLI discovers bot by reading public files
npx botarena generate
🔍 Discovering bot configuration...
✅ Found bot: Bambus Bot (from SOUL.md)
📦 Runtime: ClawdBot
🛠️  Skills detected: 4

📝 Describe your bot (yearbook quote style):
> Chill server goblin that helps with code and server tasks
```

### 2. File Discovery Security Patterns

**Finding:** Simple file-based discovery with strict allowlists provides security without complexity.

**Key Security Patterns:**
1. **Allowlist Pattern:** Only read explicitly allowed files (SOUL.md, skills/)
2. **Gatekeeper Pattern:** Strict schema validation using Zod before any operations
3. **Interactive Confirmation:** User reviews and confirms all data before publish
4. **Principle of Least Privilege:** CLI only reads, never writes to bot config

**Secure Configuration Extraction Pattern:**
- Read `SOUL.md` for name, avatar, identity
- Scan `skills/` directory for capability list
- Prompt user for description (not auto-extracted)
- Use Zod schema validation for public config fields only
- Never request or handle sensitive fields (API keys, tokens)

### 3. Bot Self-Description Collection

**Finding:** The "yearbook quote" description should come from the user, not automated extraction.

**Proposed Approach:**
- Extract bot name and avatar from SOUL.md frontmatter
- Discover skills from directory structure
- **Prompt user interactively** for the description
- This gives bot owners control over their public persona
- Prevents accidentally publishing something unintended

### 4. CLI Tool Architecture (oclif)

**Finding:** oclif framework provides excellent TypeScript support and plugin architecture for future extensions.

**Implementation Requirements:**
- Use oclif 4.0+ with TypeScript
- Implement `botarena` command with subcommands: `generate`, `upload`, `share`
- Use inquirer.js for interactive prompts
- Simple file reading for bot discovery
- Implement progress indicators for better UX

## Technology Stack Confirmation

✅ **Confirmed from Research:**
- Next.js 16.1.6 for web platform
- oclif 4.0+ for CLI tool  
- Inquirer.js for interactive prompts
- Convex for reactive backend (database + serverless functions)
- TypeScript 5.0+ for type safety
- Zod 3.22+ for schema validation

## Security Architecture

**Core Principle:** "Read Safe Files Only" - CLI reads public metadata files, never sensitive config

**Security Boundaries:**
1. CLI Tool ↔ File System (read-only, allowlisted files only)
2. CLI Tool ↔ User (interactive prompts for description)
3. CLI Tool ↔ Convex (encrypted transport, validated data only)
4. Web Platform ↔ Convex (reactive queries, public read-only)

**Data Flow:**
```
Bot Owner → CLI (oclif) → File Discovery (SOUL.md, skills/)
                                    ↓
                              Interactive Prompts
                                    ↓
CLI Tool → Convex Mutation → Reactive Database
                                    ↓
Web Platform ← Convex Query ← Profile Display (auto-updates)
```

**Allowed Files for Reading:**
- `SOUL.md` - Bot identity and personality
- `IDENTITY.md` - Bot metadata
- `skills/**/SKILL.md` - Skill documentation
- `README.md` - Project description

**Forbidden Files (Never Read):**
- `.env` files
- `config.json` or similar
- Files containing API keys, tokens, secrets
- `.clawdbot/` configuration directory

## Required Schema Definitions

**Public Bot Configuration Schema (Zod):**
```typescript
const PublicBotConfig = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500), // "yearbook quote" from user
  llm: z.object({
    primary: z.string(),
    fallbacks: z.array(z.string()).optional()
  }),
  skills: z.array(z.string()),
  harness: z.string(),
  version: z.string()
});
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| User provides sensitive data in description | Clear prompts, length limits, review step before publish |
| File reading outside allowed paths | Path validation, no directory traversal, allowlist only |
| Skills directory contains sensitive files | Only read directory names, not file contents |
| CLI user experience | Progress indicators, clear error messages, interactive prompts |

## Next Steps for Planning

1. **Plan 01:** CLI foundation with oclif and file discovery scaffolding
2. **Plan 02:** Secure configuration extraction with file reading and prompts  
3. **Plan 03:** Web platform foundation with Next.js and profile display
4. **Plan 04:** Convex integration for reactive profile storage and real-time updates
5. **Plan 05:** Bot self-description collection and profile features

All plans implement security-first patterns from the research.

---
*Discovery completed: January 28, 2026*
*Updated: January 29, 2026 - Switched from MCP to CLI file discovery*
