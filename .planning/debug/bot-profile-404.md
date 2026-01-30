---
status: resolved
trigger: "Investigate why bot profile pages return 404"
created: 2026-01-30T15:30:00Z
updated: 2026-01-30T15:45:00Z
---

## Current Focus

hypothesis: Convex backend is deployed but has no data - the bot profile page fetches from Convex HTTP API which returns 404 when profile doesn't exist
test: Verified HTTP API returns 404 for non-existent slugs, table exists but is empty
expecting: Need to either seed data or upload profiles via CLI
next_action: Report findings to user

## Symptoms

expected: Bot profile page at /bots/devbot-v1/ should display bot details
actual: Page returns 404 Not Found
errors: "NEXT_HTTP_ERROR_FALLBACK;404" - Next.js notFound() called
reproduction: Navigate to http://localhost:3000/bots/devbot-v1/
started: Always broken - no data in Convex database

## Eliminated

- hypothesis: Next.js route doesn't exist
  evidence: Route exists at src/app/bots/[slug]/page.tsx - confirmed working
  timestamp: 2026-01-30T15:35:00Z

- hypothesis: Convex HTTP API not deployed
  evidence: HTTP routes are deployed - OPTIONS request returns 200 with CORS headers
  timestamp: 2026-01-30T15:40:00Z

- hypothesis: Convex client not initialized
  evidence: NEXT_PUBLIC_CONVEX_URL is set in .env.local, client initializes correctly
  timestamp: 2026-01-30T15:38:00Z

## Evidence

- timestamp: 2026-01-30T15:35:00Z
  checked: src/app/bots/[slug]/page.tsx
  found: Page fetches from `${NEXT_PUBLIC_CONVEX_URL}/api/profiles/${slug}`
  implication: Page correctly implements HTTP API approach

- timestamp: 2026-01-30T15:38:00Z
  checked: .env.local
  found: NEXT_PUBLIC_CONVEX_URL=https://festive-wolf-805.convex.cloud
  implication: Environment variables configured correctly

- timestamp: 2026-01-30T15:40:00Z
  checked: Direct curl to Convex HTTP API
  found: curl https://festive-wolf-805.convex.cloud/api/profiles/devbot-v1 returns HTTP 404
  implication: Profile doesn't exist in database

- timestamp: 2026-01-30T15:42:00Z
  checked: Convex data via CLI
  found: "There are no documents in this table" for botProfiles
  implication: Database table exists but is completely empty

- timestamp: 2026-01-30T15:43:00Z
  checked: convex/http.ts routes
  found: GET /api/profiles/{slug} route exists and queries botProfiles.getBySlug
  implication: HTTP API is correctly implemented, just no data

## Resolution

root_cause: The Convex database has the botProfiles table and HTTP API routes deployed, but contains zero bot profiles. The FeaturedBotsSection component shows hardcoded sample bots (devbot-v1, research-assistant, data-wizard) that don't exist in the actual database. When the bot profile page tries to fetch these profiles via the Convex HTTP API, it gets 404 because the slugs don't exist.

fix: Upload bot profiles to Convex database using the CLI
verification: Not yet applied - requires user action
files_changed: []
