---
phase: 01-secure-foundation
plan: 09
subsystem: ui
tags: [react, tailwind, botcard, avatar, typography]

# Dependency graph
requires:
  - phase: 01-secure-foundation
    provides: BotCard component foundation
provides:
  - Redesigned BotCard with avatar placeholder
  - Prominent LLM display at top of card
  - Item lists showing actual skill/mcp/cli names
  - Improved hover effect complementing cream background
  - Better typography hierarchy (minimum 10px)
affects:
  - Homepage featured bots display
  - Bot profile discovery pages
  - Any future card-based layouts

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Avatar generation from name hash for consistent colors"
    - "Item list component with overflow indicator (+N)"
    - "Prominent badge placement for critical metadata"
    - "Transform-based hover effects with complementary colors"

key-files:
  created: []
  modified:
    - src/components/BotCard.tsx
    - src/app/globals.css

key-decisions:
  - "Moved LLM to top of card with accent color badge for visibility"
  - "Replaced count-based StatItem with name-based ItemList showing actual items"
  - "Used name-hash based color generation for consistent avatar colors"
  - "Changed hover shadow from gray to brown to complement cream background"

patterns-established:
  - "Avatar pattern: 40x40px with initial and hash-based background color"
  - "Item overflow: Show max 3 items with +N indicator for remainder"
  - "Typography minimum: 10px for labels, xs (12px) for content"
  - "Hover effect: Card lifts with accent-colored shadow"

# Metrics
duration: 5 min
completed: 2026-01-30
---

# Phase 01 Plan 09: Profile Card Design Fixes Summary

**Redesigned BotCard with avatar placeholder, prominent LLM badge at top, item lists showing actual names, and improved hover effect complementing cream background**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-30T15:57:30Z
- **Completed:** 2026-01-30T16:02:00Z
- **Tasks:** 3/3
- **Files modified:** 2

## Accomplishments

- Added avatar placeholder with initial and hash-based color generation
- Moved LLM to prominent position at top with brown accent badge
- Replaced count-only StatItem grid with ItemList showing actual item names
- Added overflow indicator (+N) when more than 3 items exist
- Fixed hover effect to use brown accent instead of gray, complementing cream background
- Increased minimum text size from 8-9px to 10px for better readability

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign BotCard layout with avatar and prominent LLM** - `fde9d93` (feat)
2. **Task 2: Replace StatItem counts with item name lists** - `fde9d93` (feat) - included in Task 1 commit
3. **Task 3: Fix hover effect to complement cream background** - `f82e03b` (feat)

**Plan metadata:** (to be committed)

## Files Created/Modified

- `src/components/BotCard.tsx` - Complete redesign with avatar, ItemList component, prominent LLM
- `src/app/globals.css` - Updated retro-card hover styles with transform and brown accent

## Decisions Made

- Used hash-based color generation for avatars to ensure consistent colors per bot name
- Limited item display to 3 skills, 2 MCPs, 2 CLIs with +N overflow indicator
- Moved LLM to top of card with accent-primary background for maximum visibility
- Changed hover shadow from gray (clashed with cream) to brown (complements theme)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Gap 4 (Profile Card Design Issues) is now closed
- BotCard component ready for use in homepage and discovery pages
- Remaining gaps from UAT:
  - Gap 1: CLI help command (npm cache issue)
  - Gap 2: Bot discovery improvements
  - Gap 3: Interactive mode UX
  - Gap 5: Profile page 404 (Convex data missing)
  - Gap 6: Text readability (base font size)

---
*Phase: 01-secure-foundation*
*Completed: 2026-01-30*
