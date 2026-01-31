---
phase: quick
plan: 005
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/BotDetailView/SkillCard.tsx
  - src/components/BotDetailView/McpRow.tsx
  - src/components/BotDetailView/BotDetailView.tsx
  - src/components/Badge.tsx
  - src/app/globals.css
autonomous: true
must_haves:
  truths:
    - "Skill badges have beautiful visual design with icons and color coding"
    - "MCP badges have beautiful visual design with icons and color coding"
    - "CLI badges have beautiful visual design with icons and color coding"
    - "Badges have consistent retro gaming aesthetic matching the dossier card design"
    - "Badges are visually verified in browser and approved"
  artifacts:
    - path: "src/components/BotDetailView/SkillCard.tsx"
      provides: "Beautiful skill badge component"
      min_lines: 40
    - path: "src/components/BotDetailView/McpRow.tsx"
      provides: "Beautiful MCP badge component"
      min_lines: 40
    - path: "src/components/BotDetailView/CliBadge.tsx"
      provides: "Beautiful CLI badge component"
      min_lines: 30
    - path: "src/app/globals.css"
      provides: "Enhanced badge styles"
      contains: "badge-beautiful"
  key_links:
    - from: "SkillCard/McpRow/CliBadge"
      to: "globals.css"
      via: "CSS classes"
      pattern: "badge-beautiful|badge-skill|badge-mcp|badge-cli"
---

<objective>
Make the badges on the bot detail view (skills, MCPs, CLIs sections) beautiful with a cohesive retro gaming aesthetic.

Purpose: The current badges are plain Panel components with basic text. They need visual enhancement to match the dossier card design philosophy - dense, engineered for human vision, with excellent typography and visual hierarchy.

Output: Beautifully designed badges for skills, MCPs, and CLIs with icons, color coding, and consistent retro styling.
</objective>

<execution_context>
@/Users/michaldeja/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/michaldeja/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

@/Users/michaldeja/repos/botarena/src/components/BotDetailView/BotDetailView.tsx
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/SkillCard.tsx
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/McpRow.tsx
@/Users/michaldeja/repos/botarena/src/components/Badge.tsx
@/Users/michaldeja/repos/botarena/src/components/Panel.tsx
@/Users/michaldeja/repos/botarena/src/app/globals.css

## Design Philosophy (from Quick Task 002)
- Dense, not sparse
- Explicit is better than implicit
- Engineered for human vision and perception
- Regiment functionalism
- Performance is design
- Verbosity over opacity
- Ignore design trends - timeless and unfashionable
- Flat, not hierarchical
- Diametrically opposite of minimalism
- Driven by objective reasoning and common sense
- Don't infantilize users

## Current State
- SkillCard: Plain Panel with name and optional description
- McpRow: Plain Panel with name and version
- CLIs: Plain Panel with just name
- Badge component exists but is simple (active/inactive states)
- Tag component exists with variant support (default, primary, success, warning)
- Color palette: amber primary (#b45309), success green (#166534), warning yellow (#eab308)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create beautiful badge styles in CSS</name>
  <files>src/app/globals.css</files>
  <action>
Add beautiful badge styles to globals.css following the retro gaming aesthetic:

1. Create `.badge-beautiful` base class with:
   - Retro card styling (border, shadow offset like retro-card)
   - Proper padding and typography
   - Transition effects for hover

2. Create variant classes:
   - `.badge-skill` - amber/orange accent colors (matches primary accent)
   - `.badge-mcp` - green accent colors (matches success)
   - `.badge-cli` - yellow/gold accent colors (matches warning)

3. Add icon support:
   - `.badge-icon` class for left-aligned icon
   - Use Lucide icons: Zap for skills, Server for MCPs, Terminal for CLIs

4. Include hover effects:
   - Slight lift (transform: translate)
   - Shadow enhancement
   - Color shift

5. Ensure accessibility:
   - Minimum 12px font size (already enforced)
   - WCAG AA contrast ratios
   - Focus-visible states

Reference existing `.badge-retro` and `.retro-card` classes for consistency.
  </action>
  <verify>CSS compiles without errors, no broken selectors</verify>
  <done>Beautiful badge CSS classes exist and are ready for use</done>
</task>

<task type="auto">
  <name>Task 2: Create BeautifulSkillCard component</name>
  <files>src/components/BotDetailView/SkillCard.tsx</files>
  <action>
Transform SkillCard into a beautiful badge component:

1. Import Zap icon from lucide-react
2. Replace plain Panel with beautiful badge structure:
   - Use new `.badge-beautiful` and `.badge-skill` classes
   - Add Zap icon on the left
   - Show skill name prominently
   - Show description as secondary text (if exists)
   - Show version badge if available

3. Layout structure:
   - Flex container with icon + content
   - Icon: Zap (amber colored)
   - Content: Name (bold) + Description (muted, smaller)
   - Optional: Version badge (pill style)

4. Handle different skill data shapes:
   - String skills: show as simple badge
   - Object skills: show with description and version

5. Ensure grid layout in parent still works (grid-cols-2)

Example structure:
```
┌─────────────────────────┐
│  [Zap] Skill Name    v1 │
│      Description text   │
└─────────────────────────┘
```
  </action>
  <verify>Component renders without errors, TypeScript types correct</verify>
  <done>SkillCard displays beautiful badges with icons and proper styling</done>
</task>

<task type="auto">
  <name>Task 3: Create BeautifulMcpRow and CliBadge components</name>
  <files>src/components/BotDetailView/McpRow.tsx, src/components/BotDetailView/CliBadge.tsx, src/components/BotDetailView/BotDetailView.tsx</files>
  <action>
Transform MCP and CLI displays into beautiful badges:

For McpRow.tsx:
1. Import Server icon from lucide-react
2. Use `.badge-beautiful` and `.badge-mcp` classes
3. Structure: Server icon + MCP name + version pill
4. Full-width layout (not grid like skills)
5. Show transport type if available (stdio, sse, etc.)

For CliBadge.tsx (new component):
1. Create new file src/components/BotDetailView/CliBadge.tsx
2. Import Terminal icon from lucide-react
3. Use `.badge-beautiful` and `.badge-cli` classes
4. Simple structure: Terminal icon + CLI name
5. Grid layout (grid-cols-3) in parent

Update BotDetailView.tsx:
1. Import and use CliBadge component for CLIs section
2. Ensure proper grid layout for CLIs (grid-cols-3 gap-2)
3. Update imports for updated SkillCard and McpRow

Example MCP structure:
```
┌──────────────────────────────────────────┐
│ [Server] MCP Name              [v1.0.0]  │
│            Transport: stdio              │
└──────────────────────────────────────────┘
```

Example CLI structure:
```
┌─────────────────┐
│ [Terminal] CLI  │
└─────────────────┘
```
  </action>
  <verify>Components render without errors, all imports correct</verify>
  <done>MCP and CLI sections display beautiful badges with icons</done>
</task>

<task type="auto">
  <name>Task 4: Verify with agent-browser and iterate</name>
  <files>All modified files</files>
  <action>
Use agent-browser with --cdp 9222 to verify the badge designs:

1. Start the dev server if not running:
   ```bash
   pnpm dev
   ```

2. Navigate to a bot detail page with skills, MCPs, and CLIs:
   ```bash
   agent-browser navigate "http://localhost:3000/bots/clawdbot" --cdp 9222
   ```

3. Take screenshots of:
   - Skills section (grid view)
   - MCPs section (list view)
   - CLIs section (grid view)

4. Evaluate against design criteria:
   - Visual hierarchy clear?
   - Icons appropriate and visible?
   - Colors consistent with retro aesthetic?
   - Hover effects working?
   - Typography readable (12px minimum)?
   - Dense but not cluttered?

5. Iterate on design if needed:
   - Adjust colors, spacing, shadows
   - Refine icon sizes
   - Improve contrast
   - Enhance hover states

6. Continue iterating until satisfied with the visual result.

7. Final verification: All three badge types look beautiful and cohesive.
  </action>
  <verify>Screenshots show beautiful badges, design meets criteria</verify>
  <done>Badges are visually verified and approved</done>
</task>

</tasks>

<verification>
- [ ] CSS styles added to globals.css
- [ ] SkillCard displays beautiful badges with Zap icon
- [ ] McpRow displays beautiful badges with Server icon
- [ ] CliBadge component created and used
- [ ] All badges have consistent retro styling
- [ ] Hover effects work correctly
- [ ] agent-browser screenshots show beautiful results
- [ ] Design meets dense, explicit, engineered criteria
</verification>

<success_criteria>
- Skills section shows beautiful badges with icons, names, descriptions
- MCPs section shows beautiful badges with icons, names, versions
- CLIs section shows beautiful badges with icons, names
- All badges share cohesive retro gaming aesthetic
- Badges verified visually with agent-browser and approved
- No TypeScript errors, no build errors
</success_criteria>

<output>
After completion, create `.planning/quick/005-make-badges-beautiful-bot-detail-view/005-SUMMARY.md`
</output>
