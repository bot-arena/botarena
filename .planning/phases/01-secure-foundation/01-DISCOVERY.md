# Phase 1 Discovery: Secure Foundation

**Date:** 2026-01-28  
**Phase:** 1 - Secure Foundation  
**Discovery Level:** Level 2 (Standard Research)

## Key Findings

### 1. ClawdBot Runtime Integration Patterns

**Finding:** ClawdBot configuration is stored in JSON5 format at `~/.clawdbot/` with strict schema validation. However, direct file access is explicitly prohibited by security requirements.

**Secure Extraction Approach:**
- ClawdBot provides a `gateway call` RPC interface for configuration queries
- The CLI should use MCP (Model Context Protocol) to query the runtime for public configuration
- MCP SDKs available for TypeScript/Node.js with built-in security patterns
- Configuration updates via JSON merge patch through RPC calls

**Implementation Pattern:**
```bash
# CLI should ask ClawdBot runtime (not read files)
moltbot gateway call get_public_config
```

### 2. MCP Security Patterns for Bot Configuration

**Finding:** Model Context Protocol provides standardized, secure patterns for bot configuration extraction with built-in security controls.

**Key Security Patterns from Research:**
1. **Gatekeeper Pattern:** Strict schema validation using Pydantic/Zod before any operations
2. **Fortress Pattern:** Containerized isolation to limit blast radius
3. **Human Circuit Breaker:** Two-phase commit for sensitive operations
4. **Principle of Least Privilege:** Granular permissions for all operations

**Secure Configuration Extraction Pattern:**
- Use `@modelcontext/sdk` TypeScript SDK
- Implement strict schema validation for public config fields only
- Never request or handle sensitive fields (API keys, tokens)
- Use RPC calls with timeout and retry logic
- Implement audit logging for all configuration queries

### 3. Bot Self-Description Extraction

**Finding:** Novel problem without established patterns. Requires creating a bot "personality" extraction method.

**Proposed Approach:**
- Query ClawdBot's `agents` configuration section for identity metadata
- Extract wizard metadata if available
- Fallback: Generate personality prompt asking bot to describe itself in one sentence
- Validate self-description is safe for public display (no sensitive data)

### 4. CLI Tool Architecture (oclif)

**Finding:** oclif framework provides excellent TypeScript support and plugin architecture for future extensions.

**Implementation Requirements:**
- Use oclif 4.0+ with TypeScript
- Implement `botarena` command with subcommands: `generate`, `upload`, `share`
- Use inquirer.js for interactive prompts
- Integrate with MCP SDK for secure bot communication
- Implement progress indicators for better UX

## Technology Stack Confirmation

✅ **Confirmed from Research:**
- Next.js 16.1.6 for web platform
- oclif 4.0+ for CLI tool  
- @modelcontext/sdk for bot integration
- Supabase 2.0+ for backend storage
- TypeScript 5.0+ for type safety
- Zod 3.22+ for schema validation

## Security Architecture

**Core Principle:** "Ask the Bot" - CLI queries runtime APIs, never reads raw config files

**Security Boundaries:**
1. CLI Tool ↔ ClawdBot Runtime (MCP with schema validation)
2. CLI Tool ↔ Supabase (encrypted transport, env var auth)
3. Web Platform ↔ Supabase (Row Level Security, public read-only)

**Data Flow:**
```
Bot Owner → CLI (oclif) → MCP SDK → ClawdBot Runtime → Public Config
                                    ↓
CLI Tool → Supabase API → Encrypted Storage
                                    ↓
Web Platform ← Supabase API ← Profile Display
```

## Required Schema Definitions

**Public Bot Configuration Schema (Zod):**
```typescript
const PublicBotConfig = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500), // "yearbook quote"
  llm: z.object({
    primary: z.string(),
    fallbacks: z.array(z.string()).optional()
  }),
  skills: z.array(z.string()),
  mcps: z.array(z.string()),
  clis: z.array(z.string()),
  harness: z.string(),
  version: z.string()
});
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| MCP SDK integration complexity | Use TypeScript SDK with strict typing, implement timeout/retry |
| Bot runtime API changes | Version pinning, fallback to manual prompts |
| Sensitive data leakage | Schema validation excludes sensitive fields, audit all queries |
| CLI user experience | Progress indicators, clear error messages, interactive prompts |

## Next Steps for Planning

1. **Plan 01:** CLI foundation with oclif and basic MCP integration
2. **Plan 02:** Secure configuration extraction with schema validation  
3. **Plan 03:** Web platform foundation with Next.js and profile display
4. **Plan 04:** Supabase integration for profile storage and public URLs
5. **Plan 05:** Bot self-description extraction and personality features

All plans should implement security-first patterns from the research.

---
*Discovery completed: January 28, 2026*