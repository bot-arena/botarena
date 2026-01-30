---
phase: 01-secure-foundation
plan: 07
subsystem: cli
tags: [typescript, discovery, clawdbot, skills, llm, cli]

# Dependency graph
requires:
  - phase: 01-secure-foundation
    provides: CLI foundation and bot discovery patterns
provides:
  - Recursive skills discovery with custom path support
  - LLM model discovery from mcp.json and config files
  - CLI discovery from package.json bin entries
  - SOUL.md description extraction integration
  - Enhanced bot profile accuracy
affects:
  - CLI generate command
  - Bot profile generation
  - Bot discovery accuracy

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Recursive directory scanning with depth limiting"
    - "Multi-source configuration discovery (mcp.json, package.json, SOUL.md)"
    - "Skill root detection via marker files"

key-files:
  created: []
  modified:
    - src/lib/clawdbot.ts - Enhanced discovery logic with recursive skills, LLM/CLI discovery
    - src/cli/commands/generate.ts - Integrated SOUL.md description extraction

key-decisions:
  - "Skills discovery now recursively searches nested directories up to depth 3"
  - "Skill root detection uses marker files (skill.md, README.md, package.json, skill.json)"
  - "LLM discovery prioritizes mcp.json, falls back to config files and SOUL.md parsing"
  - "CLI discovery reads package.json bin entries and CLI manifests"
  - "SOUL.md description extraction happens before interactive prompts"

patterns-established:
  - "Marker file pattern for skill root identification"
  - "Cascading fallback chain for configuration discovery"

# Metrics
duration: 15min
completed: 2026-01-30
---

# Phase 01 Plan 07: Bot Discovery Issues Fix Summary

**Enhanced discovery logic that recursively finds skills, discovers LLM/CLIs from config files, and extracts description from SOUL.md**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-30T15:56:00Z
- **Completed:** 2026-01-30T16:11:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Enhanced skills discovery with recursive search and custom --skills-path support
- Added LLM discovery from mcp.json, .clawdbot/config.json, claude.config.json, and SOUL.md
- Added CLI discovery from package.json bin entries, cli.json, and commands.json
- Integrated SOUL.md description extraction into generate command flow
- Fixed issue where Skills count always showed 0
- Fixed issue where LLM showed "Not specified" even when configured
- Fixed issue where CLIs were not discovered from package.json

## Task Commits

Each task was committed atomically:

1. **Task 1: Enhance skills discovery with recursive search** - `3b69088` (feat)
2. **Task 2: Add LLM and CLI discovery** - `1341843` (feat)
3. **Task 3: Integrate SOUL.md description extraction** - `845409c` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `src/lib/clawdbot.ts` - Enhanced discovery logic:
  - Added `skillsPath` constructor parameter for custom skills path
  - Implemented `scanSkillsRecursively()` with MAX_DEPTH limit (3)
  - Added `isSkillRoot()` for marker file detection
  - Added `extractSkillName()` to get name from package.json
  - Implemented `discoverLLM()` with multi-source fallback
  - Implemented `discoverCLIs()` for bin entries and manifests
  - Updated `extractPublicConfig()` to use discovery methods
  - Extended SKILL_DIRECTORIES with src/skills, lib/skills, agents/skills

- `src/cli/commands/generate.ts` - Integrated description extraction:
  - Added import for `extractDescriptionFromSoul`
  - Extract description from SOUL.md before interactive prompts
  - Use auto-extracted description as default for interactive mode
  - Pass autoDescription to extractPublicConfig as fallback

## Decisions Made

1. **Recursive skills discovery with depth limit** - Prevents infinite recursion while allowing nested skill directories
2. **Marker file pattern for skill roots** - Uses skill.md, README.md, package.json, or skill.json to identify skill directories
3. **Multi-source LLM discovery** - Prioritizes mcp.json, then config files, then SOUL.md parsing with regex patterns
4. **Package.json bin extraction** - Handles both single CLI (string) and multiple CLIs (object) formats

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Bot discovery now correctly identifies skills in nested directories
- LLM configuration is extracted from mcp.json and config files
- CLIs are discovered from package.json bin entries
- Description is auto-extracted from SOUL.md
- Ready for testing with actual bot projects

---
*Phase: 01-secure-foundation*
*Completed: 2026-01-30*
