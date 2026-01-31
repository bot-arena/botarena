---
phase: 006-improvements-to-bot-detail-view-debug-mo
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/BotDetailView/BotDetailView.tsx
  - src/components/BotDetailView/CopyableUrl.tsx
  - src/components/BotDetailView/ConfigSection.tsx
  - src/components/BotDetailView/NoiseAvatar.tsx
  - src/components/BotDetailView/types.ts
autonomous: true
must_haves:
  truths:
    - "Debug mode toggle hides all config sections except RAW_CONFIG"
    - "Share to X button appears next to public URL copy button"
    - "Config section headers show counts (e.g., SKILLS (5))"
    - "Noise canvas generates deterministic unique pattern based on bot ID"
  artifacts:
    - path: "src/components/BotDetailView/BotDetailView.tsx"
      provides: "Debug mode conditional rendering, section counts"
    - path: "src/components/BotDetailView/CopyableUrl.tsx"
      provides: "Share to X button"
    - path: "src/components/BotDetailView/ConfigSection.tsx"
      provides: "Count display in section headers"
    - path: "src/components/BotDetailView/NoiseAvatar.tsx"
      provides: "Deterministic noise generation from bot ID"
  key_links:
    - from: "BotDetailView"
      to: "ConfigSection"
      via: "count prop"
    - from: "BotDetailView"
      to: "NoiseAvatar"
      via: "profile.id prop"
---

<objective>
Enhance the bot detail view with four UX improvements: debug mode that hides other sections, share to X button, section counts in headers, and deterministic noise patterns based on bot ID.

Purpose: Improve developer experience with debug mode, social sharing, better information density, and unique visual identity per bot.
Output: Updated components with all four improvements integrated.
</objective>

<execution_context>
@/Users/michaldeja/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/michaldeja/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/BotDetailView.tsx
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/CopyableUrl.tsx
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/ConfigSection.tsx
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/NoiseAvatar.tsx
@/Users/michaldeja/repos/botarena/src/components/BotDetailView/types.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Debug Mode Toggle and Section Counts</name>
  <files>
    src/components/BotDetailView/BotDetailView.tsx
    src/components/ConfigSection.tsx
  </files>
  <action>
    Modify BotDetailView.tsx to implement debug mode behavior:
    1. When debugMode is true, hide all ConfigSections except RAW_CONFIG
    2. When debugMode is false, show all sections normally
    3. Add count prop to ConfigSection calls: SKILLS ({skillsData.length}), MCP_SERVERS ({mcpsData.length}), CLI_TOOLS ({clisData.length})
    
    Modify ConfigSection.tsx to accept optional count prop:
    1. Add count?: number to ConfigSectionProps interface
    2. Display count in header button: "{title} [{count}]" when count is provided
    3. Keep existing expand/collapse behavior unchanged
    
    The debug mode should work as a view filter - when enabled, only RAW_CONFIG section renders (if debugMode is true). All other sections (LLM_CONFIG, SKILLS, MCP_SERVERS, CLI_TOOLS) should be conditionally rendered based on !debugMode.
  </action>
  <verify>
    Check TypeScript compilation: `pnpm tsc --noEmit`
    Check that ConfigSection properly displays counts in headers
  </verify>
  <done>
    Debug mode hides all sections except RAW_CONFIG; section headers show counts like "SKILLS [5]"
  </done>
</task>

<task type="auto">
  <name>Task 2: Share to X Button</name>
  <files>
    src/components/BotDetailView/CopyableUrl.tsx
  </files>
  <action>
    Add a share to X (Twitter) button next to the copy button in CopyableUrl component:
    1. Import X icon from lucide-react (use `import { Twitter } from 'lucide-react'` since X is aliased as Twitter in lucide-react)
    2. Add a second RetroButton next to the COPY button
    3. Button should open X share intent: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this bot: ${url}`)}`
    4. Use Twitter icon from lucide-react inside the button
    5. Add aria-label="Share on X" for accessibility
    6. Style should match existing COPY button (use same RetroButton component)
    
    The layout should be: [Input field] [COPY button] [X button with Twitter icon]
  </action>
  <verify>
    Check TypeScript compilation: `pnpm tsc --noEmit`
    Verify Twitter icon imports correctly from lucide-react
  </verify>
  <done>
    Share to X button appears next to copy button, opens X share intent with bot URL
  </done>
</task>

<task type="auto">
  <name>Task 3: Deterministic Noise Canvas Based on Bot ID</name>
  <files>
    src/components/BotDetailView/NoiseAvatar.tsx
    src/components/BotDetailView/types.ts
    src/components/BotDetailView/BotDetailView.tsx
  </files>
  <action>
    Modify NoiseAvatar to generate deterministic unique patterns based on bot ID (like Gravatar):
    
    1. Update NoiseAvatarProps interface in NoiseAvatar.tsx to accept optional id prop
    2. Create a deterministic pseudo-random number generator using the bot ID as seed:
       - Use a simple hash function on the ID string to generate seed
       - Use mulberry32 or similar PRNG that produces consistent output for same seed
    3. Replace Math.random() calls in renderNoise with the seeded PRNG
    4. The noise should be static (not animated) when an ID is provided - remove animation loop for deterministic mode
    5. When no ID is provided, fall back to animated random noise (current behavior)
    6. Update BotDetailView.tsx to pass profile.id to NoiseAvatar component
    
    The pattern should be:
    - Same ID always produces same noise pattern
    - Different IDs produce visually distinct patterns
    - Pattern is static (no animation) when ID-based
    - Falls back to animated random noise when no ID provided
    
    Example hash/PRNG approach:
    ```typescript
    function cyrb128(str: string): number {
      let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
      for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
      }
      h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
      h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
      h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
      h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
      return (h1^h2^h3^h4) >>> 0;
    }
    
    function mulberry32(a: number) {
      return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      }
    }
    ```
  </action>
  <verify>
    Check TypeScript compilation: `pnpm tsc --noEmit`
    Verify same ID produces same pattern, different IDs produce different patterns
  </verify>
  <done>
    NoiseAvatar accepts id prop, generates deterministic static pattern based on ID, falls back to animated random when no ID
  </done>
</task>

</tasks>

<verification>
- Debug mode toggle hides LLM_CONFIG, SKILLS, MCP_SERVERS, CLI_TOOLS sections
- Only RAW_CONFIG visible when debug mode enabled
- Section headers display counts: "SKILLS [5]", "MCP_SERVERS [3]", etc.
- Share to X button opens twitter.com/intent/tweet with bot URL
- Noise canvas shows unique static pattern per bot ID
- Same bot always shows same pattern, different bots show different patterns
</verification>

<success_criteria>
All four improvements working:
1. Debug mode filters view to show only RAW_CONFIG section
2. Share to X button functional next to copy button
3. Config sections display item counts in headers
4. Noise canvas generates deterministic unique patterns from bot ID
</success_criteria>

<output>
After completion, create `.planning/quick/006-improvements-to-bot-detail-view-debug-mo/006-SUMMARY.md`
</output>
