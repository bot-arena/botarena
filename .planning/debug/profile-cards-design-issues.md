---
status: investigating
trigger: "profile cards design issues reported in UAT Test 7 - missing avatar, LLM visibility, stats showing counts vs items, bad hover effect"
created: 2026-01-30T16:30:00Z
updated: 2026-01-30T16:35:00Z
---

## Current Focus

hypothesis: BotCard.tsx has multiple design issues: no avatar placeholder, poor LLM visibility, stats show counts instead of actual items, and bad hover effect (cream card with gray shadow becoming foreground)
test: Analyzing BotCard.tsx, RetroCard.tsx, and globals.css to identify all issues
expecting: Complete list of design problems with specific file locations
next_action: Compile structured report with root cause, artifacts, and missing components

## Symptoms

expected: Profile cards should have excellent typographical hierarchy with avatar placeholder, visible LLM info, meaningful stats showing actual items used, and good hover visual effect
actual: Cards lack avatar, LLM is barely visible, stats show only counts ("6 skills, 3 mcps, 2 clis"), hover effect makes gray shadow foreground which looks bad on cream card
errors: None - design/UX issues
reproduction: View /discover page with bot cards
started: Always present

## Eliminated

- hypothesis: Avatar component exists but not imported
  evidence: Searched for avatar/Avatar/placeholder - no avatar component exists in the codebase
  timestamp: 2026-01-30T16:32:00Z

## Evidence

- timestamp: 2026-01-30T16:30:00Z
  checked: BotCard.tsx structure
  found: Component displays bot name, rarity badge, harness/version, description, stats (counts only), and LLM at bottom in tiny text
  implication: Missing avatar entirely, LLM visibility is poor (9px uppercase at bottom), stats are just numbers

- timestamp: 2026-01-30T16:31:00Z
  checked: globals.css retro-card styles (lines 110-131)
  found: Card has cream background (#fefce8), ::after pseudo-element creates shadow effect with accent-primary color (#b45309), on hover changes to accent-secondary (#4a4a4a - gray)
  implication: Hover changes shadow from brown to gray, which clashes badly with cream card foreground

- timestamp: 2026-01-30T16:32:00Z
  checked: StatItem component in BotCard.tsx (lines 118-131)
  found: Only displays value (number) and label (SKILLS/MCPS/CLIS), no actual item names shown
  implication: Users see "6" instead of which 6 skills are used

- timestamp: 2026-01-30T16:33:00Z
  checked: LLM display in BotCard.tsx (lines 99-108)
  found: LLM shown as "PRIMARY_LLM: {name}" in 9px uppercase text at very bottom of card, mixed with timestamp
  implication: LLM is critical info but visually buried - small font, uppercase (harder to read), at bottom

- timestamp: 2026-01-30T16:34:00Z
  checked: BotDetailView.tsx for avatar pattern
  found: Detail view uses getBotIcon(profile.llm.primary) to show emoji avatar in a bordered square
  implication: Card should use similar pattern but currently has nothing

## Resolution

root_caused: 
  1. NO AVATAR PLACEHOLDER: BotCard.tsx has no visual identifier/avatar for the bot
  2. POOR LLM VISIBILITY: LLM shown at bottom in 9px uppercase text, mixed with timestamp - no visual prominence
  3. STATS SHOW COUNTS ONLY: StatItem component only displays numbers (6, 3, 2) not actual skill/mcp/cli names
  4. BAD HOVER EFFECT: globals.css line 129-131 changes shadow from brown to gray on hover, creating visual clash with cream card

fix: 
verification: 
files_changed: []
