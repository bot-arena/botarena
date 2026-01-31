---
phase: 001-redesign-botcard-component-creative-dire
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/BotCard.tsx
autonomous: true

must_haves:
  truths:
    - "Bot card shows name, LLM, quote, harness, version, skills, MCPs, and CLIs (when present)."
    - "Card reads as a dossier-style, board-game character card with explicit labels and dense information blocks."
    - "Card remains a clickable RetroCard linking to the bot profile."
  artifacts:
    - path: "src/components/BotCard.tsx"
      provides: "Dossier-style BotCard layout with labeled data blocks and dense typography"
      exports: ["BotCard"]
  key_links:
    - from: "src/components/BotCard.tsx"
      to: "src/components/RetroCard.tsx"
      via: "RetroCard wrapper"
      pattern: "<RetroCard"
    - from: "src/components/BotCard.tsx"
      to: "next/link"
      via: "Link to /bots/[slug]"
      pattern: "href=\"/bots/"
    - from: "src/components/BotCard.tsx"
      to: "TagList"
      via: "Skills/MCPs/CLIs sections"
      pattern: "<TagList"
---

<objective>
Redesign BotCard into a dense dossier-style character card that foregrounds explicit labels and data blocks while keeping RetroCard as the base.

Purpose: Align the bot showcase with a timeless, utilitarian aesthetic for tinkerers and self-hosters.
Output: Updated BotCard layout and styling in `src/components/BotCard.tsx`.
</objective>

<execution_context>
@/Users/michaldeja/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/michaldeja/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/RetroCard.tsx
@src/components/BotCard.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rebuild BotCard structure as a dossier-style data sheet</name>
  <files>src/components/BotCard.tsx</files>
  <action>
    Re-structure the BotCard markup to resemble a board-game character card or dossier. Use explicit labels and dense, flat blocks (no nested hierarchy feel). Preserve the existing data sources, Link behavior, and RetroCard wrapper.

    Requirements:
    - Include labeled fields for Name, LLM (primary + fallback count), Harness, Version, and Updated.
    - Keep the quote/description as a distinct "Quote" or "Field Note" block with visible label.
    - Keep Skills/MCPs/CLIs as labeled sections; show CLIs only when present.
    - Use a compact, columnar layout (definition list or table-like grid) to emphasize data density.
    - Keep hover/click behavior intact and avoid removing existing utility imports.
  </action>
  <verify>Check `src/components/BotCard.tsx` includes all required labels and data blocks.</verify>
  <done>All required fields are visible with explicit labels and the structure reads like a dossier.</done>
</task>

<task type="auto">
  <name>Task 2: Apply dossier typography and functional ornamentation</name>
  <files>src/components/BotCard.tsx</files>
  <action>
    Apply a typography system and separators that emphasize precision and readability: small uppercase labels, tight line-height for metadata, mono or tabular numerals for version/LLM counts, and strong rule lines to separate blocks. Favor flat surfaces, no trendy effects, and minimal motion; prioritize performance and clarity.

    Constraints:
    - Keep text sizes >= 12px and ensure 16px body baseline where appropriate.
    - Use existing CSS variables for borders/text; avoid new global styles.
    - Maintain dense spacing without truncating critical labels.
  </action>
  <verify>pnpm lint</verify>
  <done>BotCard presents a dense dossier aesthetic with crisp labels, rule lines, and readable typography.</done>
</task>

</tasks>

<verification>
- BotCard renders with explicit labeled blocks for all required fields.
- Dossier-style layout is dense and flat, with clear separators and legible typography.
- Link and RetroCard interaction remain intact.
</verification>

<success_criteria>
- BotCard includes name, LLM, quote, harness, skills, MCPs, CLIs (when present), and version with explicit labels.
- Visual structure reads as a board-game/dossier card: compact grid, rule lines, and data-list styling.
- No new global CSS or new dependencies introduced.
</success_criteria>

<output>
After completion, create `.planning/quick/001-redesign-botcard-component-creative-dire/001-SUMMARY.md`
</output>
