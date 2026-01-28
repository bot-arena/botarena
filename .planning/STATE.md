# BotArena State

**Project:** AI Bot Showcase Platform  
**Last Updated:** 2026-01-28  
**Current Focus:** Roadmap Creation

## Project Reference

### Core Value
Bot owners can proudly showcase their meticulously crafted AI agent configurations in a beautiful, easily comparable format.

### Current Focus
Establishing secure foundation phase that enables bot owners to safely generate and publish ClawdBot profiles without exposing sensitive configuration data.

## Current Position

**Phase:** Not Started (Roadmap Creation)  
**Current Plan:** Roadmap created with 3-phase structure  
**Status:** Ready to begin Phase 1 planning  
**Progress Bar:** 0% (0/11 success criteria complete)

### Next Steps
1. `/gsd-plan-phase 1` - Plan Phase 1: Secure Foundation
2. Begin Phase 1 implementation
3. Validate success criteria completion

## Performance Metrics

### Development Metrics
- **Phase Success Criteria:** 11 total across 3 phases
- **Requirements Coverage:** 8/8 v1 requirements mapped ✓
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

### Architecture Decisions
- **CLI Tool:** Secure local bot config discovery via runtime APIs (never raw files)
- **Web Platform:** Next.js with Convex reactive backend for profile hosting
- **Security Pattern:** Dedicated Security Service with envelope encryption
- **Data Structure:** Convex document-relational database with TypeScript schema for flexible bot profiles

### Security Constraints
- Never read raw configuration files directly
- Only accept data explicitly provided by bot runtimes
- Implement envelope encryption for any sensitive fields
- Clear security boundaries between CLI, web platform, and services

### Technical Stack Chosen
- **Frontend:** Next.js 16.1.6, Motion 12.29.0, Tailwind CSS, Radix UI
- **Backend:** Convex with reactive TypeScript queries and automatic transactions
- **CLI:** oclif 4.0+ framework, Node.js 22 LTS
- **Security:** Zod validation, MCP SDK integration, node-forge cryptography

## Session Continuity

### What We Know
- BotArena is a showcase platform for AI bot configurations
- Security-first architecture with "ask the bot" pattern
- 3-phase roadmap delivering 8 v1 requirements
- ClawdBot as initial integration target
- Gaming-inspired visualization (Dota 2 hero style) as differentiator

### What We're Working On
- Roadmap has been created and validated
- Ready to begin Phase 1 planning and implementation
- Phase 1 focuses on secure CLI tool and basic profile display

### What We Need to Track
- Security boundary adherence during implementation
- Integration complexity with various bot runtimes
- Gaming visualization performance impact in Phase 3
- User adoption metrics post-launch

### Blockers & Risks
- **High Risk:** MCP integration complexity with emerging protocol
- **Medium Risk:** Gaming UI performance optimization requirements
- **Low Risk:** Search and filtering implementation patterns (well-documented)

### Open Questions
- How to handle malformed bot responses during secure config extraction?
- What fallback mechanisms for bot runtimes that don't support API queries?
- Performance optimization strategies for complex gaming animations?

---

*State initialized: 2026-01-28*  
*Next action: /gsd-plan-phase 1*