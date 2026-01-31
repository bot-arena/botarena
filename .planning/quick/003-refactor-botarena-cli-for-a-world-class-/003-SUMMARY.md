---
phase: quick-003-refactor-botarena-cli-for-a-world-class
plan: 003
subsystem: cli
tags: [cli, oclif, guides, publish, convex, schema, ui]

# Dependency graph
requires: []
provides:
  - Agent-first CLI guides with explicit next-command templates
  - Explicit override flags for identity, LLM, and tools
  - Publish command and metadata wiring through Convex + UI
affects: [cli, convex, web]
---

# Phase quick-003-refactor-botarena-cli-for-a-world-class Plan 003 Summary

**BotArena CLI now defaults to agent-first guidance, requires explicit inputs for generation, and publishes profiles via a dedicated publish command with schema/UI support.**

## Accomplishments
- Added main and generate-specific Markdown guides plus richer help output with formats, examples, and full skills directory list.
- Reworked generate flow for explicit flags, JSON-only output, and publish handoff without interactive defaults.
- Updated Convex schema + API mapping and frontend rendering for avatar, createdAt/updatedAt metadata, and LLM fallbacks.

## Task Commits
1. **Task 1-2: Agent-first CLI + publish wiring** - `996a77c` (feat)

## Files Created/Modified
- `src/cli/commands/index.ts` - Main guide command for `botarena`.
- `src/cli/commands/generate.ts` - Explicit flag handling and guide mode.
- `src/cli/commands/publish.ts` - Publish command (renamed from upload).
- `src/cli/guides.ts` - Agent-first guide templates.
- `src/cli/help.ts` - Help extensions with formats and examples.
- `src/lib/clawdbot.ts` - Skills directory list and override plumbing.
- `convex/schema.ts` - Avatar + metadata fields.
- `convex/botProfiles.ts` - Metadata persistence.
- `convex/http.ts` - Publish mapping defaults.
- `src/components/BotDetailView/BotDetailView.tsx` - Avatar rendering.
- `src/components/BotCard.tsx` - Avatar rendering.
- `src/app/bots/[slug]/page.tsx` - Profile normalization.
- `README.md`, `CLI-README.md` - Publish flow docs.

## Decisions Made
- Keep `description` as the canonical field name and treat it as the yearbook quote.
- Make `publish` the canonical command name (remove upload).
- Require explicit `name`, `description`, `harness`, and `llm` in non-interactive mode.

## Deviations from Plan
- Combined Task 1 and Task 2 into a single implementation commit.

## Issues Encountered
- apply_patch stalled during initial execution; edits were completed manually.

## User Setup Required
None.

---
*Phase: quick-003-refactor-botarena-cli-for-a-world-class*
*Completed: 2026-01-31*
