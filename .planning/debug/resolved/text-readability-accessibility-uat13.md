---
status: investigating
trigger: "Investigate text readability/accessibility issues reported in UAT Test 13 - Text is too small and not readable/accessible"
created: 2026-01-30T16:15:00Z
updated: 2026-01-30T16:15:00Z
---

## Current Focus

hypothesis: Text readability issues are caused by small base font sizes, poor contrast ratios, or lack of responsive typography scaling
test: Examine CSS/Tailwind configuration for typography settings, base font sizes, and responsive breakpoints
expecting: Identify specific font size values, contrast issues, and missing responsive scaling
next_action: Read globals.css and tailwind.config.js to understand typography setup

## Symptoms

expected: Text should be readable and accessible across all devices, with appropriate font sizes and contrast ratios
actual: Text is too small and not readable/accessible (per UAT Test 13)
errors: None - visual/design issue
reproduction: View any page with text content, particularly on mobile devices
started: Reported in UAT Test 13

## Eliminated

## Evidence

- timestamp: 2026-01-30T16:15:00Z
  checked: globals.css base typography
  found: body font-size is 10px (line 40) - extremely small base font size
  implication: All text inherits this tiny base size unless explicitly overridden

- timestamp: 2026-01-30T16:15:00Z
  checked: globals.css component classes
  found: Multiple component classes use tiny font sizes - badge-retro (9px), section-label (9px), filter-tag (9px), config-header (12px)
  implication: Design system relies on sub-10px fonts which are not accessible

- timestamp: 2026-01-30T16:15:00Z
  checked: tailwind.config.js
  found: No custom fontSize extension, no responsive typography scale defined
  implication: Using default Tailwind font sizes without mobile-first responsive adjustments

- timestamp: 2026-01-30T16:15:00Z
  checked: color contrast in globals.css
  found: --color-text-primary: #2d2d2d on --color-bg-primary: #d1d5db (gray on gray)
  implication: Contrast ratio may be insufficient for accessibility

- timestamp: 2026-01-30T16:16:00Z
  checked: Component text sizes in BotCard.tsx, discover/page.tsx, HeroSection.tsx
  found: Extensive use of text-[8px], text-[9px], text-[10px] inline styles throughout components
  implication: Multiple components hardcode tiny font sizes, making text unreadable especially on mobile

- timestamp: 2026-01-30T16:16:00Z
  checked: Tailwind responsive breakpoints usage
  found: No responsive font size scaling (no md:, lg: prefixes on text classes)
  implication: Same tiny text size on all screen sizes - no mobile-first responsive typography

- timestamp: 2026-01-30T16:16:00Z
  checked: WCAG contrast requirements
  found: --color-text-secondary: #4a4a4a and --color-text-tertiary: #71717a on light gray backgrounds
  implication: Tertiary text at #71717a likely fails WCAG AA contrast (4.5:1) for normal text

## Resolution

root_cause: Multiple critical typography issues - 10px base font size, extensive use of 8-10px text throughout components, no responsive font scaling, and tertiary text failing WCAG AA contrast (3.28:1 vs required 4.5:1)
fix: Not yet applied - requires increasing base font size to 16px, scaling up component text sizes, adding responsive typography, and improving contrast
verification: Not yet verified
files_changed: []
