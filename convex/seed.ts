import { mutation } from "./_generated/server";

/**
 * Development Seed Data for BotArena
 * 
 * Provides sample bot profiles for local development and testing.
 * These profiles populate the database so /bots/[slug] pages work
 * and the homepage displays real data instead of hardcoded samples.
 */

/**
 * Sample bot profiles for development
 * Diverse examples showcasing different bot types and capabilities
 */
const SAMPLE_BOTS = [
  {
    owner: null,
    name: "DevBot",
    description: "A helpful development assistant with deep knowledge of modern web technologies.",
    modelPrimary: "anthropic/claude-3-5-sonnet",
    modelFallbacks: ["openai/gpt-4"],
    harness: "ClawdBot",
    skills: ["typescript", "react", "nextjs", "tailwind", "convex"],
    mcps: ["filesystem", "github", "terminal"],
    clis: ["botarena", "clawdbot"],
    version: "1.0.0",
    updateTime: new Date().toISOString(),
  },
  {
    owner: null,
    name: "Code Reviewer Pro",
    description: "Expert at reviewing code for security, performance, and best practices.",
    modelPrimary: "openai/gpt-4",
    modelFallbacks: [],
    harness: "ClawdBot",
    skills: ["security", "performance", "testing", "ci-cd"],
    mcps: ["github", "gitlab"],
    clis: ["eslint", "prettier"],
    version: "2.1.0",
    updateTime: new Date().toISOString(),
  },
  {
    owner: null,
    name: "Documentation Writer",
    description: "Specializes in creating clear, comprehensive technical documentation.",
    modelPrimary: "anthropic/claude-3-opus",
    modelFallbacks: ["anthropic/claude-3-5-sonnet"],
    harness: "ClawdBot",
    skills: ["technical-writing", "markdown", "api-docs", "tutorials"],
    mcps: ["filesystem", "web-search"],
    clis: ["mdbook", "vitepress"],
    version: "0.5.0",
    updateTime: new Date().toISOString(),
  },
  {
    owner: null,
    name: "Test Automation Bot",
    description: "Generates comprehensive test suites and maintains test coverage.",
    modelPrimary: "anthropic/claude-3-5-sonnet",
    modelFallbacks: ["openai/gpt-4", "anthropic/claude-3-haiku"],
    harness: "ClawdBot",
    skills: ["unit-testing", "integration-testing", "e2e-testing", "jest", "playwright"],
    mcps: ["filesystem", "github"],
    clis: ["jest", "playwright", "vitest"],
    version: "1.2.3",
    updateTime: new Date().toISOString(),
  },
];

/**
 * Mutation: Seed development profiles
 * 
 * Inserts sample bot profiles into the database for local development.
 * Skips if profiles already exist to avoid duplicates.
 * 
 * @returns Object with count of seeded profiles and status message
 */
export const seedDevProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if database already has profiles
    const existing = await ctx.db.query("botProfiles").collect();
    
    if (existing.length > 0) {
      console.log(`Database already has ${existing.length} profiles, skipping seed`);
      return { 
        seeded: 0, 
        message: "Database already populated",
        existingCount: existing.length,
      };
    }
    
    // Insert each sample bot
    const slugs: string[] = [];
    for (const bot of SAMPLE_BOTS) {
      const profileId = await ctx.db.insert("botProfiles", {
        ...bot,
        slug: "pending",
      });
      await ctx.db.patch(profileId, {
        slug: profileId,
        updateTime: new Date().toISOString(),
      });
      slugs.push(profileId);
    }
    
    console.log(`Seeded ${SAMPLE_BOTS.length} development profiles`);
    return { 
      seeded: SAMPLE_BOTS.length, 
      message: "Development profiles seeded successfully",
      slugs,
    };
  },
});

/**
 * Mutation: Clear all development profiles
 * 
 * Removes all bot profiles from the database.
 * Useful for resetting to a clean state.
 * 
 * @returns Object with count of cleared profiles
 */
export const clearDevProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("botProfiles").collect();
    
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
    }
    
    console.log(`Cleared ${profiles.length} profiles`);
    return { 
      cleared: profiles.length,
      message: profiles.length > 0 
        ? `Cleared ${profiles.length} profiles` 
        : "No profiles to clear",
    };
  },
});

/**
 * Query: Check seed status
 * 
 * Returns information about current database state
 * for verification purposes.
 */
export const getSeedStatus = mutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("botProfiles").collect();
    
    return {
      count: profiles.length,
      isSeeded: profiles.length > 0,
      slugs: profiles.map(p => p.slug),
    };
  },
});
