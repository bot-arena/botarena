# BotArena State

**Project:** AI Bot Showcase Platform  
**Last Updated:** 2026-01-29  
**Current Focus:** Phase 1 Complete - Ready for Discovery Phase

## Project Reference

### Core Value
Bot owners can proudly showcase their meticulously crafted AI agent configurations in a beautiful, easily comparable format.

### Current Focus
Phase 1 (Secure Foundation) is complete. Bot owners can now safely generate and publish ClawdBot profiles via CLI and view them on public profile pages.

## Current Position

**Phase:** 1 of 3 (Secure Foundation)  
**Plan:** 9 of 9 complete in current phase  
**Status:** Phase 1 Complete ✓  
**Last activity:** 2026-01-30 - Completed 01-10-PLAN.md (Gap 5: Profile Database Seeding)

Progress: ██████████ 50% (6/12 success criteria)

### Gap Closure Progress
- ✅ **Gap 1:** CLI Help Output Issue - Documented npx cache troubleshooting
- ✅ **Gap 2:** Bot Discovery (skills, MCP, CLI) - Recursive skills discovery, LLM/CLI extraction, SOUL.md description
- ✅ **Gap 3:** Interactive Mode UX - CLI now defaults to non-interactive with --description and --yes flags
- ✅ **Gap 4:** Profile Card Design - Complete with avatar, prominent LLM, item lists
- ✅ **Gap 5:** Bot Profile 404 (DB seeding) - Seed mutations, CLI script, HTTP endpoints, documentation
- ⏳ **Gap 6:** Text Readability/Accessibility - Pending

### Next Steps
1. Initialize Convex project (`npx convex dev`)
2. Begin Phase 2: Discovery & Basic Comparison
3. Implement search, filtering, and comparison features

## Performance Metrics

### Development Metrics
- **Phase Success Criteria:** 13 total across 3 phases
- **Completed:** 5/13 (Phase 1: 5/5) ✓
- **Requirements Coverage:** 9/9 v1 requirements mapped ✓
- **Architecture Adherence:** "Ask the Bot" security pattern maintained

### Success Metrics (Post-launch)
- **Profile Generation Rate:** Number of successful `npx botarena` executions
- **Profile Discovery Rate:** Search/filter usage on botarena.sh
- **Comparison Engagement:** Side-by-side comparison usage
- **Share Rate:** Public profile URL sharing frequency

## Accumulated Context

### Key Decisions Made

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| "Ask the Bot" approach for data collection | Security paramount — botarena must never touch raw config files containing secrets | CLI tool queries bot runtime APIs for public config only |
| 3-Phase Roadmap Structure | Balance security foundation with user engagement while maintaining manageable scope | Phase 1: Secure Foundation → Phase 2: Discovery → Phase 3: Gaming Enhancement |
| ClawdBot as Initial Target | Currently viral and serves as beachhead market | All v1 requirements focused on ClawdBot integration |
| Convex HTTP API for server components | Avoids client/server boundary issues with generated types | Direct fetch to Convex endpoints in server components |
| Gaming-inspired UI with glassmorphism | Creates emotional attachment while maintaining data clarity | Backdrop blur, gradient backgrounds, motion animations |
| Transparent documentation for known issues | Build user trust by acknowledging problems with clear solutions | CLI README documents v0.0.2 stub cache issue with @latest workaround |
| CLI defaults to non-interactive mode | Bot automation and CI/CD pipelines require non-interactive operation | CLI runs without prompts by default, --interactive flag enables human prompts |
| Flag-based CLI automation | Enable complete automation of profile generation workflow | --description and --yes flags allow bot-driven profile generation without prompts |
| Recursive skills discovery | Support nested skill directories and custom paths | scanSkillsRecursively() with marker file detection and MAX_DEPTH limit |
| Multi-source LLM discovery | Extract model info from various config sources | Cascading fallback: mcp.json → config files → SOUL.md parsing |
| SOUL.md description extraction | Auto-extract bot description from SOUL.md content | extractDescriptionFromSoul() integrated into generate flow |
| Convex seed mutations for development | Database needs sample data for development and testing | seedDevProfiles mutation with 4 diverse sample bots |
| CLI database seeding | Developers need easy way to populate database | scripts/seed-profiles.ts with seed/clear/status commands |

### Architecture Decisions
- **CLI Tool:** Secure local bot config discovery via runtime APIs (never raw files)
- **Web Platform:** Next.js with Convex reactive backend for profile hosting
- **Security Pattern:** Dedicated Security Service with envelope encryption
- **Data Structure:** Convex document-relational database with TypeScript schema for flexible bot profiles
- **UI Pattern:** Gaming-inspired retro gaming style with Motion animations

### Security Constraints
- Never read raw configuration files directly
- Only accept data explicitly provided by bot runtimes
- Implement envelope encryption for any sensitive fields
- Clear security boundaries between CLI, web platform, and services

### Technical Stack Chosen
- **Frontend:** Next.js 16.1.6, Motion 12.29.0, Tailwind CSS, Radix UI
- **Backend:** Convex with reactive TypeScript queries and automatic transactions
- **CLI:** oclif 4.0+ framework, Node.js 22 LTS
- **Security:** Zod validation, file-based discovery (not MCP), node-forge cryptography

## Session Continuity

### What We Know
- BotArena is a showcase platform for AI bot configurations
- Security-first architecture with "ask the bot" pattern
- 3-phase roadmap delivering 9 v1 requirements
- ClawdBot as initial integration target
- Gaming-inspired visualization (retro gaming style) as differentiator
- Phase 1 complete with CLI generation, Convex backend, and profile pages

### What We're Working On
- Phase 1 has 9 plans (5 original + 4 gap closures), 9/9 complete
- CLI documentation improved with npx cache troubleshooting
- CLI now bot-friendly with non-interactive default and automation flags
- Database seeding complete with seed mutations and CLI script
- Gap closure in progress - addressing UAT findings from 01-secure-foundation-UAT.md
- Remaining gap: Text readability/accessibility
- Ready to begin Phase 2: Discovery & Basic Comparison after gap closure

### What We Need to Track
- Convex initialization status (types generation)
- Search and filtering implementation patterns
- Side-by-side comparison UI design
- Gaming visualization performance impact in Phase 3
- User adoption metrics post-launch

### Blockers & Risks
- **Medium Risk:** Convex project needs initialization before Phase 2 testing
- **Medium Risk:** Gaming UI performance optimization requirements
- **Low Risk:** Search and filtering implementation patterns (well-documented)
- **Resolved:** MCP integration complexity (switched to file discovery)

### Open Questions
- How to handle malformed bot responses during secure config extraction?
- What fallback mechanisms for bot runtimes that don't support API queries?
- Performance optimization strategies for complex gaming animations?

---

*State updated: 2026-01-30*  
*Last action: Completed Phase 1, Plan 10 (Gap 5: Profile Database Seeding)*
