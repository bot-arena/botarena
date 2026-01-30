#!/usr/bin/env tsx

/**
 * Seed Development Profiles Script
 * 
 * CLI script to populate Convex database with development bot profiles.
 * 
 * Usage:
 *   pnpm seed          # Seed with development profiles
 *   pnpm seed:clear    # Clear all profiles
 *   pnpm seed:status   # Check seed status
 * 
 * This script connects to the Convex HTTP API and invokes the seed mutations.
 */

import { ConvexHttpClient } from "convex/browser";

// Get Convex URL from environment or use default dev server
const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ CONVEX_URL not set");
  console.error("");
  console.error("Please set one of:");
  console.error("  - CONVEX_URL environment variable");
  console.error("  - NEXT_PUBLIC_CONVEX_URL environment variable");
  console.error("  - Or ensure .env.local has NEXT_PUBLIC_CONVEX_URL");
  console.error("");
  console.error("Example:");
  console.error("  export CONVEX_URL=https://your-deployment.convex.cloud");
  process.exit(1);
}

// Parse command
const command = process.argv[2] || "seed";

// Type definitions for seed results
interface SeedStatusResult {
  count: number;
  isSeeded: boolean;
  slugs: string[];
}

interface SeedResult {
  seeded: number;
  message: string;
  existingCount?: number;
  slugs?: string[];
}

interface ClearResult {
  cleared: number;
  message: string;
}

async function seedProfiles() {
  console.log("🌱 Seeding development bot profiles...");
  console.log(`   Connecting to Convex at ${CONVEX_URL}`);
  console.log("");

  const client = new ConvexHttpClient(CONVEX_URL as string);

  try {
    // First check current status
    const statusResult = await client.mutation(
      "seed:getSeedStatus" as unknown as import("convex/server").FunctionReference<"mutation">, 
      {}
    ) as SeedStatusResult;
    console.log(`   Current database status: ${statusResult.count} profiles`);
    
    if (statusResult.isSeeded) {
      console.log("   Existing profiles:", statusResult.slugs.join(", "));
    }
    console.log("");

    // Run seed mutation
    const result = await client.mutation(
      "seed:seedDevProfiles" as unknown as import("convex/server").FunctionReference<"mutation">, 
      {}
    ) as SeedResult;

    if (result.seeded > 0) {
      console.log(`✅ Successfully seeded ${result.seeded} development profiles`);
      console.log("");
      console.log("   Created profiles:");
      result.slugs?.forEach((slug: string) => {
        console.log(`     • http://localhost:3000/bots/${slug}`);
      });
      console.log("");
      console.log("   Visit http://localhost:3000 to see them featured on the homepage");
    } else {
      console.log(`ℹ️  ${result.message}`);
      console.log(`   Existing profiles: ${result.existingCount}`);
      console.log("");
      console.log("   To clear and re-seed, run: pnpm seed:clear");
    }

    return result;
  } catch (error) {
    console.error("❌ Failed to seed profiles:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error(`   ${String(error)}`);
    }
    console.log("");
    console.log("   Troubleshooting:");
    console.log("     1. Ensure Convex dev server is running: pnpm convex dev");
    console.log("     2. Check CONVEX_URL is correct in .env.local");
    console.log("     3. Verify Convex deployment is accessible");
    process.exit(1);
  }
}

async function clearProfiles() {
  console.log("🗑️  Clearing all bot profiles...");
  console.log(`   Connecting to Convex at ${CONVEX_URL}`);
  console.log("");

  const client = new ConvexHttpClient(CONVEX_URL as string);

  try {
    const result = await client.mutation(
      "seed:clearDevProfiles" as unknown as import("convex/server").FunctionReference<"mutation">, 
      {}
    ) as ClearResult;

    if (result.cleared > 0) {
      console.log(`✅ Cleared ${result.cleared} profiles`);
    } else {
      console.log("ℹ️  No profiles to clear");
    }

    return result;
  } catch (error) {
    console.error("❌ Failed to clear profiles:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error(`   ${String(error)}`);
    }
    process.exit(1);
  }
}

async function checkStatus() {
  console.log("📊 Checking database status...");
  console.log(`   Connecting to Convex at ${CONVEX_URL}`);
  console.log("");

  const client = new ConvexHttpClient(CONVEX_URL as string);

  try {
    const result = await client.mutation(
      "seed:getSeedStatus" as unknown as import("convex/server").FunctionReference<"mutation">, 
      {}
    ) as SeedStatusResult;

    console.log(`   Database has ${result.count} profile(s)`);
    
    if (result.isSeeded) {
      console.log("   Status: ✅ Seeded");
      console.log("   Profiles:");
      result.slugs.forEach((slug: string) => {
        console.log(`     • ${slug}`);
      });
    } else {
      console.log("   Status: ⚠️  Empty");
      console.log("   Run 'pnpm seed' to populate with development profiles");
    }

    return result;
  } catch (error) {
    console.error("❌ Failed to check status:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error(`   ${String(error)}`);
    }
    process.exit(1);
  }
}

// Main execution
async function main() {
  switch (command) {
    case "seed":
    case "populate":
      await seedProfiles();
      break;
    case "clear":
      await clearProfiles();
      break;
    case "status":
      await checkStatus();
      break;
    default:
      console.log("BotArena Database Seed Script");
      console.log("");
      console.log("Usage:");
      console.log("  pnpm seed           Seed with development profiles");
      console.log("  pnpm seed:clear     Clear all profiles");
      console.log("  pnpm seed:status    Check database status");
      console.log("");
      console.log("Or run directly:");
      console.log("  tsx scripts/seed-profiles.ts [seed|clear|status]");
      process.exit(0);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
