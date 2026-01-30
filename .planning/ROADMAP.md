# BotArena Roadmap

**Project:** AI Bot Showcase Platform  
**Core Value:** Bot owners can proudly showcase their meticulously crafted AI agent configurations in a beautiful, easily comparable format.  
**Created:** 2026-01-28  
**Depth:** Standard (3 phases)  
**Coverage:** 9/9 v1 requirements mapped ✓

## Overview

BotArena delivers a secure showcase platform where AI bot owners can publish and compare their agent configurations through a CLI tool that safely extracts public configuration data. The platform progresses from secure foundation through discovery capabilities to gaming-inspired presentation that creates emotional attachment to bot profiles. Battles and voting features are deferred to v2.

## Phases

### Phase 1: Secure Foundation

**Goal:** Bot owners can safely generate and display ClawdBot profiles

**Dependencies:** None (foundation phase)

**Requirements:**
- CLI-01: Provide `npx botarena` command for delightful profile generation
- CLI-02: Implement secure ClawdBot configuration extraction (ask bot, never read files)
- PROF-01: Display ClawdBot core stats (LLM, skills, MCPs, CLIs, harness) in beautiful profile page
- PROF-02: Provide public profile URLs for sharing bot configurations
- PROF-06: Capture bot self-description (one-sentence "yearbook quote" style personality showcase)

**Success Criteria:**
1. Bot owner can run `npx botarena` and successfully generate a public profile
2. Bot owner can view their ClawdBot profile at botarena.sh with core stats displayed
3. Bot owner can share public profile URL with others
4. Bot owner sees bot's self-description ("yearbook quote") on profile page
5. The CLI never accesses raw config files (security verification)

**Plans:** 11 plans (5 original + 6 gap closure) — ALL COMPLETE ✓

Original Plans:
- [x] 01-01-PLAN.md — CLI foundation with oclif and bot configuration schema
- [x] 01-02-PLAN.md — Secure ClawdBot configuration extraction using MCP SDK
- [x] 01-03-PLAN.md — Next.js web platform foundation with profile display components
- [x] 01-04-PLAN.md — Convex reactive backend integration for profile storage and real-time API
- [x] 01-05-PLAN.md — End-to-end profile generation and display with public URLs

Gap Closure Plans (from UAT verification):
- [x] 01-06-PLAN.md — Fix CLI help output issue (npx cache documentation)
- [x] 01-07-PLAN.md — Fix bot discovery (skills, LLM, CLIs, description extraction)
- [x] 01-08-PLAN.md — Fix interactive mode UX (non-interactive default, flags)
- [x] 01-09-PLAN.md — Fix profile card design (avatar, LLM, item names, hover)
- [x] 01-10-PLAN.md — Fix profile pages 404 (seed data for Convex)
- [x] 01-11-PLAN.md — Fix text readability (16px base, WCAG AA contrast)

---

### Phase 2: Discovery & Basic Comparison

**Goal:** Users can find and compare different ClawdBots

**Dependencies:** Phase 1 (secure foundation and profile display)

**Requirements:**
- PROF-03: Enable basic search and discovery of ClawdBots
- PROF-04: Filter ClawdBots by specific capabilities (skills, models)
- COMP-01: Enable side-by-side ClawdBot comparison for configuration analysis

**Success Criteria:**
1. User can search for ClawdBots and see a list of results
2. User can filter ClawdBots by specific skills or models
3. User can compare two ClawdBots side-by-side to see configuration differences
4. User can navigate from search results to individual bot profiles

---

### Phase 3: Gaming-Inspired Enhancement

**Goal:** Bot profiles have engaging, game-inspired presentation

**Dependencies:** Phase 2 (discovery and comparison functionality)

**Requirements:**
- PROF-05: Implement gaming-inspired visualization (retro gaming style presentation)

**Success Criteria:**
1. User sees retro gaming style visual presentation on bot profiles
2. Bot stats are displayed with gaming-inspired animations and styling
3. The visual design maintains data clarity while adding emotional engagement
4. Profile presentation creates memorable, shareable bot representations

---

## Progress

| Phase | Status | Requirements Mapped | Success Criteria Met |
|-------|--------|-------------------|---------------------|
| 1 - Secure Foundation | ✅ Complete | 5/5 | 5/5 |
| 2 - Discovery & Basic Comparison | Not Started | 3/3 | 0/4 |
| 3 - Gaming-Inspired Enhancement | Not Started | 1/1 | 0/4 |

**Overall Progress:** 5/13 success criteria complete (38%)

## Phase Dependencies

```
Phase 1 (Secure Foundation)
    ↓
Phase 2 (Discovery & Basic Comparison)
    ↓
Phase 3 (Gaming-Inspired Enhancement)
```

## Research Notes

**Phase 1:** Complex integration patterns for various bot runtimes beyond ClawdBot - needs runtime-specific API research  
**Phase 3:** Gaming UI implementation patterns - Motion library advanced usage and performance optimization needs research

---

*Roadmap created: 2026-01-28*  
*Ready for phase planning: /gsd-plan-phase 1*