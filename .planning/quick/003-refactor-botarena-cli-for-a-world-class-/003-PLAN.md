---
phase: quick-003-refactor-botarena-cli-for-a-world-class
plan: 003
type: execute
wave: 1
depends_on: []
files_modified:
  - src/cli/commands/index.ts
  - src/cli/commands/generate.ts
  - src/cli/commands/upload.ts
  - src/cli/guides.ts
  - src/lib/clawdbot.ts
  - src/schemas/bot-config.ts
  - convex/schema.ts
  - convex/botProfiles.ts
  - convex/http.ts
  - src/app/bots/[slug]/page.tsx
  - src/components/BotDetailView/BotDetailView.tsx
  - src/components/BotDetailView/types.ts
  - src/components/BotCard.tsx
autonomous: false

must_haves:
  truths:
    - "Running `botarena` with no subcommand prints a main Markdown guide (agent-aware) with 4 info categories, yearbook quote guidance, and a next-command template"
    - "Running `botarena generate` with no/insufficient flags prints a generate-specific Markdown guide and exits without interactive prompts"
    - "Flags --model/--llm, --skills, --mcps, and --clis accept comma-separated strings and override discovery"
    - "Help output for `botarena --help` and `botarena generate --help` documents formats, shows example values, and includes the full skills directory list"
    - "Generated profile JSON includes name, quote (or description), harness, llm primary+fallbacks, skills, mcps, clis; publish adds createdAt/updatedAt/version metadata"
    - "Backend schema and frontend rendering accept and display the updated fields"
  artifacts:
    - path: "src/cli/commands/index.ts"
      provides: "Main CLI guide output for `botarena`"
    - path: "src/cli/commands/generate.ts"
      provides: "Generate guide output, help text, and override flags"
    - path: "src/cli/guides.ts"
      provides: "Shared Markdown guide templates"
    - path: "src/lib/clawdbot.ts"
      provides: "Skills directory list used in help output"
    - path: "src/schemas/bot-config.ts"
      provides: "Public profile schema reflecting quote/description and llm config"
    - path: "convex/schema.ts"
      provides: "Backend schema fields for llm, skills, mcps, clis, metadata"
    - path: "convex/http.ts"
      provides: "HTTP profile creation mapping for new fields"
    - path: "src/app/bots/[slug]/page.tsx"
      provides: "Frontend normalization of profile fields"
    - path: "src/components/BotDetailView/BotDetailView.tsx"
      provides: "Detail rendering for quote/llm/skills/mcps/clis/metadata"
  key_links:
    - from: "src/cli/commands/index.ts"
      to: "src/cli/guides.ts"
      via: "guide string output"
      pattern: "mainGuide"
    - from: "src/cli/commands/generate.ts"
      to: "src/lib/clawdbot.ts"
      via: "skills directory list in help"
      pattern: "SKILL_DIRECTORIES"
    - from: "src/cli/commands/generate.ts"
      to: "src/lib/clawdbot.ts"
      via: "override inputs into discovery"
      pattern: "extractPublicConfig"
    - from: "convex/http.ts"
      to: "convex/botProfiles.ts"
      via: "createProfile mutation"
      pattern: "api.botProfiles.createProfile"
    - from: "src/app/bots/[slug]/page.tsx"
      to: "src/components/BotDetailView/BotDetailView.tsx"
      via: "profile normalization + render"
      pattern: "<BotDetailView"
---

<objective>
Refactor the BotArena CLI and profile data flow so the CLI provides world-class, agent-aware guidance, supports override flags, and the backend/frontend fully accept and render the expanded profile fields.

Purpose: Align the CLI UX and profile schema with the new success criteria while keeping the security-first discovery pattern.
Output: Updated CLI guides/help, override flag wiring, and profile schema + rendering updates.
</objective>

<execution_context>
@/Users/michaldeja/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/michaldeja/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@src/cli/commands/generate.ts
@src/cli/commands/upload.ts
@src/lib/clawdbot.ts
@src/schemas/bot-config.ts
@convex/schema.ts
@convex/botProfiles.ts
@convex/http.ts
@src/app/bots/[slug]/page.tsx
@src/components/BotDetailView/BotDetailView.tsx
@src/components/BotDetailView/types.ts
@src/components/BotCard.tsx
</context>

<tasks>

<task type="checkpoint:decision" gate="blocking">
  <decision>Define the required behavior for (a) quote vs description, (b) publish metadata, and (c) what counts as "insufficient flags" for `botarena generate`.</decision>
  <context>
    Success criteria mention a `quote` field, a `publish` step adding metadata, and a generate guide when flags are insufficient. The current code only has `description`, and there is no `publish` command. We need a precise mapping to implement the CLI, schema, and UI correctly.
  </context>
  <options>
    <option id="option-a">
      <name>Keep `description` as the primary field and add `quote` as an alias in JSON output</name>
      <pros>Minimal UI changes; preserves existing schema; easiest backwards compatibility.</pros>
      <cons>Adds dual fields in payloads; requires explicit mapping rules.</cons>
    </option>
    <option id="option-b">
      <name>Rename to `quote` across schema + UI (deprecate `description`)</name>
      <pros>Matches success criteria verbatim; unambiguous field name.</pros>
      <cons>Wider refactor; risks breaking existing profiles or UI assumptions.</cons>
    </option>
    <option id="option-c">
      <name>Treat `quote` as UI label only (no new field), keep API field as `description`</name>
      <pros>No schema change; aligns with existing data shape.</pros>
      <cons>Success criteria might be interpreted as unmet.</cons>
    </option>
    <option id="option-d">
      <name>Define `publish` as the existing `upload` path and add createdAt/updatedAt/version server-side</name>
      <pros>No new command; leverages Convex timestamps; smallest CLI changes.</pros>
      <cons>Terminology mismatch if a new publish command was intended.</cons>
    </option>
    <option id="option-e">
      <name>Define `insufficient flags` as: non-interactive + no description + no override lists</name>
      <pros>Deterministic; aligns with guidance for automated usage.</pros>
      <cons>May be stricter than needed if discovery alone should be valid.</cons>
    </option>
  </options>
  <resume-signal>Select: option-a/b/c and option-d or alternative, plus option-e or alternative definition for insufficient flags.</resume-signal>
</task>

<task type="auto">
  <name>Task 1: Add CLI guides and help output for base + generate commands</name>
  <files>src/cli/commands/index.ts, src/cli/commands/generate.ts, src/cli/guides.ts, src/lib/clawdbot.ts</files>
  <action>
    Implement the Markdown guides and help content:
    - Create `src/cli/guides.ts` exporting `mainGuide` and `generateGuide` strings. Ensure the main guide is agent-aware, contains 4 info categories, includes yearbook quote guidance, and ends with a next-command template (literal command scaffolding).
    - Add `src/cli/commands/index.ts` to handle `botarena` with no subcommand: print `mainGuide` to stdout and exit 0.
    - Update `src/cli/commands/generate.ts` so running `botarena generate` with the agreed "insufficient flags" prints `generateGuide` (non-interactive) and exits without discovery or prompts.
    - Update help output for `botarena --help` and `botarena generate --help`:
      - Document comma-separated formats for `--skills`, `--mcps`, `--clis`, and `--model/--llm`.
      - Include example values for each flag.
      - Include the comprehensive skills directory list (export SKILL_DIRECTORIES from `src/lib/clawdbot.ts` or relocate it to a shared constant).
    - Keep guide content ASCII-only and avoid new dependencies.
  </action>
  <verify>
    Run `pnpm build:cli` and then `node dist/cli/index.js` plus `node dist/cli/commands/generate.js` (or `pnpm botarena --help` if available) to confirm the guides and help output render with the required sections and list.
  </verify>
  <done>
    Base and generate guides print correctly, help output includes formats/examples and the full skills directory list.
  </done>
</task>

<task type="auto">
  <name>Task 2: Wire override flags and profile metadata through CLI, backend, and UI</name>
  <files>src/cli/commands/generate.ts, src/cli/commands/upload.ts, src/lib/clawdbot.ts, src/schemas/bot-config.ts, convex/schema.ts, convex/botProfiles.ts, convex/http.ts, src/app/bots/[slug]/page.tsx, src/components/BotDetailView/BotDetailView.tsx, src/components/BotDetailView/types.ts, src/components/BotCard.tsx</files>
  <action>
    Implement end-to-end data wiring based on the decision in Task 0:
    - Add new flags to `generate.ts`: `--model` (alias `--llm`), `--skills`, `--mcps`, `--clis` accepting comma-separated strings. Parse into string arrays, trim whitespace, and treat empty segments as invalid.
    - Ensure these flags override discovery results: if provided, use them instead of discovered lists and LLM model. Preserve discovery for missing fields only.
    - Update `src/schemas/bot-config.ts` to match the final profile JSON shape (quote/description decision, llm primary + fallbacks, skills/mcps/clis, harness, version) and validate overrides.
    - Add or map metadata (createdAt/updatedAt/version) in the publish path as defined (likely in `convex/http.ts` + `convex/botProfiles.ts`). Ensure schema supports storage and updates (add fields to `convex/schema.ts` if needed).
    - Update `generateProfile` and `uploadProfile` so JSON output includes the required fields and metadata path is consistent with the publish decision.
    - Update frontend normalization in `src/app/bots/[slug]/page.tsx` and rendering in `BotDetailView` / `BotCard` to accept and display the final fields, including quote/description and metadata labels.
  </action>
  <verify>
    Run `pnpm build:cli` and verify `botarena generate --model gpt-4o --skills a,b --mcps x --clis y --dry-run` produces JSON containing the required fields. Confirm a sample profile from `/api/profiles/:slug` renders the updated fields in the UI.
  </verify>
  <done>
    Override flags work end-to-end, publish metadata is present, and frontend renders the updated profile fields without regressions.
  </done>
</task>

</tasks>

<verification>
- `botarena` prints the main guide with required sections and next-command template.
- `botarena generate` prints the generate guide when invoked without required flags.
- Help output documents comma-separated formats and lists all skills directories.
- Overrides produce expected JSON and backend/frontend accept the fields.
</verification>

<success_criteria>
- All six success criteria provided in the request are met with deterministic CLI output and consistent schema/UI handling.
</success_criteria>

<output>
After completion, create `.planning/quick/003-refactor-botarena-cli-for-a-world-class-/003-SUMMARY.md`
</output>
