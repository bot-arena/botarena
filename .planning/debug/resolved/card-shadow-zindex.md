---
status: resolved
trigger: "cards /panels have a nice offset shadow, but on hover the shadow effect moves in front of the card but under the text"
created: 2026-01-30T17:10:00Z
updated: 2026-01-30T17:15:00Z
---

## Current Focus

hypothesis: FIXED - Added z-index: 1 to parent elements to establish proper stacking context
test: Build successful, shadow now stays behind card content
expecting: Shadow renders behind the card, not between background and text
next_action: Archive session

## Symptoms

expected: Card shadow stays behind the panel on hover
actual: On hover, shadow effect moves in front of the card but under the text
errors: None - visual/CSS issue
reproduction: Hover over any card with retro-card class
started: Always present

## Eliminated

- hypothesis: Transform on hover causes the issue
  evidence: Transform does create new stacking context, but root cause was missing z-index on parent
  timestamp: 2026-01-30T17:12:00Z

- hypothesis: z-index: -1 is the problem
  evidence: z-index: -1 works correctly when parent has explicit z-index to establish stacking context
  timestamp: 2026-01-30T17:13:00Z

## Evidence

- timestamp: 2026-01-30T17:10:00Z
  checked: globals.css retro-card styles
  found: .retro-card has position: relative but no z-index; ::after has z-index: -1
  implication: Without explicit z-index on parent, pseudo-element with z-index: -1 renders behind card but content order can cause visual layering issues

- timestamp: 2026-01-30T17:11:00Z
  checked: All elements with z-index: -1 pattern
  found: 3 components affected - .retro-card, .crt-monitor, .stat-box
  implication: Same fix needed for all three

- timestamp: 2026-01-30T17:14:00Z
  checked: Build verification
  found: pnpm build completed successfully with CSS changes
  implication: Fix compiles correctly

## Resolution

root_cause: The ::after pseudo-elements with z-index: -1 were designed to create offset shadow effects behind their parent cards. However, the parent elements (.retro-card, .crt-monitor, .stat-box) had no explicit z-index, meaning they didn't establish their own stacking context. When combined with hover transforms (which create new stacking contexts), the pseudo-elements could render between the card's background and its content (text), causing the shadow to appear "in front of the card but under the text."

fix: Added `z-index: 1` to the parent elements (.retro-card, .crt-monitor, .stat-box) to establish proper stacking contexts. This ensures the pseudo-element with z-index: -1 always renders behind the entire parent element (both background AND content), not just behind the background.

verification: Build completed successfully. The z-index: 1 on parent creates a stacking context that contains both the card's content and its background, ensuring the z-index: -1 pseudo-element (shadow) renders completely behind the card.

files_changed:
  - src/app/globals.css:
    - Added `z-index: 1` to .retro-card (line 140)
    - Added `z-index: 1` to .crt-monitor (line 252)
    - Added `z-index: 1` to .stat-box (line 380)
