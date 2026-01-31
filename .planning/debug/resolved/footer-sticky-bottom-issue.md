---
status: resolved
trigger: "footer doesnt stay at the very bottom of the page on layout changes"
created: 2026-01-31T00:00:00Z
updated: 2026-01-31T00:00:00Z
---

## Current Focus

hypothesis: The footer is not positioned at the bottom because the layout structure doesn't use flexbox to push it down. The body has min-h-screen but the inner div structure doesn't ensure footer sticks to bottom when content is short.
test: Examine layout structure and CSS to identify why footer floats up on short pages
expecting: Find missing flex-col + flex-grow pattern or missing mt-auto/absolute positioning
next_action: Analyze layout.tsx structure and identify the fix needed

## Symptoms

expected: Footer should stick to the bottom of the viewport, even when content is short
actual: Footer floats up in the middle of the page when content is short
errors: No console errors, visual/layout issue only
reproduction: Navigate to pages with little content (short pages)
started: Recently noticed, unsure if it ever worked correctly

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-01-31T00:00:00Z
  checked: layout.tsx structure
  found: |
    - body has `min-h-screen` 
    - Inner wrapper div also has `min-h-screen relative`
    - Footer is inside the z-10 relative div, after main content
    - Main has `pb-[80px] md:pb-0` (padding for footer on mobile only)
  implication: The footer is positioned in normal document flow, not stuck to bottom. When content is short, the container doesn't extend to push footer down.

- timestamp: 2026-01-31T00:00:00Z
  checked: Footer component
  found: Footer is `hidden md:block` (hidden on mobile, visible on desktop). No positioning styles (no sticky, fixed, or absolute)
  implication: Footer relies on layout structure to position it at bottom, but layout doesn't enforce this

## Resolution

root_cause: |
  The layout structure in layout.tsx uses `min-h-screen` on the wrapper div but doesn't use flexbox 
  to push the footer to the bottom. The inner div has `min-h-screen relative` but no `flex flex-col`, 
  and the main content doesn't have `flex-grow`. When page content is short, the footer floats up 
  in the middle of the viewport instead of sticking to the bottom.

fix: |
  1. Added `flex flex-col` to the outer wrapper div (line 36)
  2. Added `flex flex-col flex-grow` to the inner content div (line 38) 
  3. Added `flex-grow` to the main element (line 40)
  
  This creates a flex container where the main content grows to fill available space,
  pushing the footer to the bottom of the viewport when content is short.

verification: |
  - Layout structure verified in layout.tsx
  - HTML output confirms correct class application: `min-h-screen relative flex flex-col` on wrapper,
    `relative z-10 flex flex-col flex-grow` on content div, `flex-grow` on main
  - Flexbox pattern ensures footer stays at bottom on short pages

files_changed:
  - src/app/layout.tsx: Added flexbox classes to fix sticky footer
