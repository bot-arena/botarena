---
phase: quick
plan: 004
type: execute
wave: 1
depends_on: []
files_modified: [
  "src/app/discover/page.tsx",
  "convex/botProfiles.ts",
  "src/components/BotCard.tsx"
]
autonomous: true

must_haves:
  truths:
    - "Discover page fetches real bot profiles from Convex database"
    - "Search filters bots by name in real-time"
    - "Harness filter shows only matching bots"
    - "Sort works by updated/name/skills count"
    - "Pagination loads more bots on demand"
    - "Actions bar is not a panel - clean inline design"
    - "Page renders fast with proper loading states"
  artifacts:
    - path: "src/app/discover/page.tsx"
      provides: "Discover page with Convex data fetching, search, filter, sort, pagination"
    - path: "convex/botProfiles.ts"
      provides: "Paginated query with search/filter support"
  key_links:
    - from: "src/app/discover/page.tsx"
      to: "convex/botProfiles.listProfilesPaginated"
      via: "usePaginatedQuery"
---

<objective>
Transform the /discover page from using hardcoded MOCK_BOTS to fetching real data from Convex with proper search, filter, sort, and pagination. Clean up the actions bar to not be a panel.

Purpose: Enable users to browse all bot profiles stored in the database with a fast, responsive interface.
Output: Working discover page with real data, search/filter/sort functionality, pagination, and improved UI.
</objective>

<execution_context>
@/Users/michaldeja/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/michaldeja/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/michaldeja/repos/botarena/.planning/STATE.md
@/Users/michaldeja/repos/botarena/src/app/discover/page.tsx
@/Users/michaldeja/repos/botarena/convex/botProfiles.ts
@/Users/michaldeja/repos/botarena/src/components/BotCard.tsx
@/Users/michaldeja/repos/botarena/convex/schema.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add paginated query with search/filter to Convex</name>
  <files>convex/botProfiles.ts</files>
  <action>
    Add a new query `listProfilesPaginated` to convex/botProfiles.ts that supports:
    - Pagination using Convex's paginated queries (cursor-based)
    - Optional searchQuery parameter for filtering by name (case-insensitive substring match)
    - Optional harness parameter for filtering by harness type
    - Optional sortBy parameter: 'updated' (default), 'name', 'skills'
    
    Use Convex's query with pagination pattern:
    ```typescript
    import { query } from "./_generated/server";
    import { paginationOptsValidator } from "convex/server";
    
    export const listProfilesPaginated = query({
      args: {
        paginationOpts: paginationOptsValidator,
        searchQuery: v.optional(v.string()),
        harness: v.optional(v.string()),
        sortBy: v.optional(v.union(v.literal("updated"), v.literal("name"), v.literal("skills"))),
      },
      handler: async (ctx, args) => {
        // Filter logic then paginate
      },
    });
    ```
    
    For search, use case-insensitive filtering on name.
    For harness filter, only apply if harness !== 'all'.
    For sort:
    - 'updated': order by _creationTime desc
    - 'name': order by name asc  
    - 'skills': fetch all, sort by skills.length, then paginate in memory
    
    Return the standard Convex paginated result format.
  </action>
  <verify>Run `npx convex dev` or check that TypeScript compiles without errors in convex/botProfiles.ts</verify>
  <done>New listProfilesPaginated query exists with paginationOptsValidator, supports searchQuery, harness, and sortBy parameters</done>
</task>

<task type="auto">
  <name>Task 2: Refactor discover page to use real data</name>
  <files>src/app/discover/page.tsx</files>
  <action>
    Rewrite src/app/discover/page.tsx to:
    
    1. Use Convex's `usePaginatedQuery` hook for data fetching
    2. Remove MOCK_BOTS completely
    3. Transform database profiles to BotCardProfile format:
       - Map _id to id
       - Map modelPrimary/modelFallbacks to llm.primary/llm.fallbacks
       - Map updateTime to updatedAt (as Date)
       - Ensure all required fields present
    
    4. Keep existing filter state (search, harness, sortBy) but wire to query
    5. Add pagination:
       - Show "Load More" button when more results available
       - Use status === "CanLoadMore" from usePaginatedQuery
       - Call loadMore(12) to fetch next page
    
    6. Add loading states:
       - Initial loading skeleton (3-6 placeholder cards)
       - Loading more indicator at bottom
    
    7. UI cleanup - Actions bar redesign:
       - Remove the retro-card panel wrapper around filters
       - Use clean inline layout with subtle borders
       - Keep the search input, harness filter tags, and sort select
       - Make it compact and elegant, not a prominent panel
       - Example structure:
         ```
         <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b border-[var(--color-border-strong)]">
           <div className="flex-1">[Search]</div>
           <div className="flex flex-wrap gap-2">[Harness filters]</div>
           <div>[Sort]</div>
         </div>
         ```
    
    8. Handle empty states:
       - Show message when no bots match filters
       - Show total results count
    
    Import pattern:
    ```typescript
    import { usePaginatedQuery } from "convex/react";
    import { api } from "@/../convex/_generated/api";
    ```
  </action>
  <verify>Run `pnpm build` to check for TypeScript errors</verify>
  <done>Page uses usePaginatedQuery, fetches real data, has working pagination, clean actions bar without panel styling</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Verify discover page with agent-browser</name>
  <what-built>
    Discover page with:
    - Real bot profiles from Convex database
    - Live search filtering
    - Harness type filtering (ALL, CLAWDBOT, etc.)
    - Sort by updated/name/skills
    - Pagination with "Load More" button
    - Clean actions bar (not a panel)
    - Loading states and empty states
  </what-built>
  <how-to-verify>
    1. Ensure Convex dev server is running: `npx convex dev`
    2. Ensure Next.js dev server is running: `pnpm dev`
    3. Seed database if empty: `pnpm seed` or `curl -X POST http://localhost:3000/api/seed`
    4. Use agent-browser to verify:
       ```
       /agent-browser --cdp 9222
       Navigate to http://localhost:3000/discover
       ```
    5. Verify these behaviors:
       - Page loads and shows real bot dossiers (not mock data)
       - Search box filters bots as you type
       - Harness filter buttons (ALL, CLAWDBOT) filter results
       - Sort dropdown changes ordering
       - "Load More" button appears if more than 12 bots
       - Actions bar is clean inline layout, not a card/panel
       - Cards are clickable and link to /bots/[slug]
       - Loading skeleton shows initially
    6. Take screenshot to verify visual design
  </how-to-verify>
  <resume-signal>Type "approved" if discover page looks good with real data, or describe issues</resume-signal>
</task>

</tasks>

<verification>
- [ ] Convex query `listProfilesPaginated` exists with pagination support
- [ ] Discover page uses `usePaginatedQuery` hook
- [ ] Real bot profiles display from database
- [ ] Search filters by name (case-insensitive)
- [ ] Harness filter works (ALL, CLAWDBOT, etc.)
- [ ] Sort by updated/name/skills works
- [ ] Pagination loads more results
- [ ] Actions bar is clean inline layout (not a panel)
- [ ] Loading states work correctly
- [ ] Verified with agent-browser at http://localhost:3000/discover
</verification>

<success_criteria>
1. Discover page fetches and displays real bot profiles from Convex
2. Search, filter, and sort functionality works in real-time
3. Pagination loads additional bots on demand
4. Actions bar has clean inline design (not a retro-card panel)
5. Page verified with agent-browser showing beautiful bot dossiers
6. Fast initial load with proper loading skeletons
</success_criteria>

<output>
After completion, create `.planning/quick/004-discover-page-doesnt-use-the-records-fro/004-SUMMARY.md`
</output>
