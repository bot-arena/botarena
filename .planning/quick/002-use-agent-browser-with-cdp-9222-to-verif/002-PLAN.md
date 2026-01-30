---
phase: quick-002-use-agent-browser-with-cdp-9222-to-verif
plan: 002
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/BotCard.tsx
autonomous: true

must_haves:
  truths:
    - "Bot card presents name, LLM, quote, harness, version, skills, MCPs, and CLIs in a dense dossier layout"
    - "Card reads like a board game character card with explicit labels and datalist styling"
    - "Visual hierarchy is clear without relying on minimalism or empty space"
  artifacts:
    - path: "src/components/BotCard.tsx"
      provides: "Dossier-style BotCard layout and typography using RetroCard"
  key_links:
    - from: "src/components/BotCard.tsx"
      to: "src/components/RetroCard.tsx"
      via: "RetroCard container usage"
      pattern: "<RetroCard"
---

<objective>
Redesign BotCard to a dense, dossier-style board game character card while keeping RetroCard as the base container.

Purpose: Match the explicit, functional, timeless design philosophy for tinkerers and open-source users.
Output: Updated BotCard markup and styles with labeled datalist sections and strong typography.
</objective>

<execution_context>
@/Users/michaldeja/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/michaldeja/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/BotCard.tsx
@src/components/RetroCard.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Restructure BotCard into dossier layout</name>
  <files>src/components/BotCard.tsx</files>
  <action>
Replace the current stacked layout with a dense dossier layout using RetroCard. Requirements:
- Keep RetroCard as the outer container; do not create a new card base component.
- Present explicit labeled rows for: Name, LLM (primary + fallbacks count), Quote (description), Harness, Version, Skills, MCPs, CLIs.
- Use a datalist or ledger style: label column + value column with compact spacing, strong typographic hierarchy, and no empty decorative whitespace.
- Maintain avatar/initial but treat it as a field (e.g., "ID" or "Mark") rather than a hero image.
- Preserve rarity badge but integrate it as a dossier attribute (e.g., "Rank" or "Rarity").
- Keep Tag/TagList usage only if it supports dense listing; otherwise render compact inline chips with explicit labels.
- Ensure the layout is flat (no nested cards), explicit (labels shown), and dense (no line-clamp on quote).
</action>
  <verify>
Open any page that renders BotCard and confirm all required fields are visible with labels and the layout is dense and dossier-like.
  </verify>
  <done>
BotCard renders a labeled, compact dossier layout with all required fields visible and RetroCard still used as the container.
  </done>
</task>

<task type="auto">
  <name>Task 2: Apply typography and hierarchy for dossier style</name>
  <files>src/components/BotCard.tsx</files>
  <action>
Adjust typography and spacing to reflect a board game character card and regimented functionalism:
- Use a strong type hierarchy (title, section labels, data values) without decorative trends.
- Use uppercase labels, fixed label widths, and dense line-height for a data-sheet feel.
- Favor clarity over aesthetics: explicit separators, ruled lines, or grid-like alignment.
- Keep colors aligned with existing design tokens (var(--color-*)); avoid new palette additions.
</action>
  <verify>
Visually scan the card to ensure the hierarchy reads top-to-bottom with clear labels and minimal whitespace.
  </verify>
  <done>
Typography and spacing communicate a dense, explicit dossier card; no minimal or airy sections remain.
  </done>
</task>

<task type="auto">
  <name>Task 3: Verify UI with agent-browser over CDP 9222</name>
  <files>src/components/BotCard.tsx</files>
  <action>
Use the agent-browser tool connected to Chrome via CDP on port 9222 to verify the redesign:
- Start the dev server if not running.
- Connect agent-browser with `--cdp 9222`.
- Navigate to a page that shows multiple BotCard instances.
- Capture a screenshot and note any layout or readability regressions.
</action>
  <verify>
agent-browser session shows the dossier-style BotCard with all required labeled fields and no truncation of the quote.
  </verify>
  <done>
Verification completed via agent-browser on CDP 9222 with acceptable visual result.
  </done>
</task>

</tasks>

<verification>
- BotCard renders all required fields with explicit labels.
- RetroCard remains the base container.
- Design reads as a dense dossier/character card and remains accessible.
</verification>

<success_criteria>
- BotCard reflects the stated design philosophy: dense, explicit, timeless, functional, non-minimal.
- All required fields (name, llm, quote, harness, skills, mcps, clis, version) are visible.
- agent-browser verification completed on CDP 9222.
</success_criteria>

<output>
After completion, create `.planning/quick/002-use-agent-browser-with-cdp-9222-to-verif/002-SUMMARY.md`
</output>
