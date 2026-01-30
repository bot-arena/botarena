import { v } from "convex/values";
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
    slug: "devbot-v1",
    name: "DevBot",
    description: "A helpful development assistant with deep knowledge of modern web technologies.",
    llmPrimary: "claude-3-sonnet",
    llmFallbacks: ["gpt-4"],
    harness: "ClawdBot",
    skills: ["typescript", "react", "nextjs", "tailwind", "convex"],
    mcps: ["filesystem", "github", "terminal"],
    clis: ["botarena", "clawdbot"],
    version: "1.0.0",
    config: {
      runtime: "ClawdBot",
      primaryModel: "claude-3-sonnet",
      capabilities: ["code-review", "refactoring", "architecture"],
    },
  },
  {
    slug: "code-reviewer-pro",
    name: "Code Reviewer Pro",
    description: "Expert at reviewing code for security, performance, and best practices.",
    llmPrimary: "gpt-4",
    llmFallbacks: [],
    harness: "ClawdBot",
    skills: ["security", "performance", "testing", "ci-cd"],
    mcps: ["github", "gitlab"],
    clis: ["eslint", "prettier"],
    version: "2.1.0",
    config: {
      runtime: "ClawdBot",
      primaryModel: "gpt-4",
      capabilities: ["security-audit", "performance-analysis", "test-coverage"],
    },
  },
  {
    slug: "docs-writer",
    name: "Documentation Writer",
    description: "Specializes in creating clear, comprehensive technical documentation.",
    llmPrimary: "claude-3-opus",
    llmFallbacks: ["claude-3-sonnet"],
    harness: "ClawdBot",
    skills: ["technical-writing", "markdown", "api-docs", "tutorials"],
    mcps: ["filesystem", "web-search"],
    clis: ["mdbook", "vitepress"],
    version: "0.5.0",
    config: {
      runtime: "ClawdBot",
      primaryModel: "claude-3-opus",
      capabilities: ["documentation", "api-specs", "tutorials"],
    },
  },
  {
    slug: "test-automation-bot",
    name: "Test Automation Bot",
    description: "Generates comprehensive test suites and maintains test coverage.",
    llmPrimary: "claude-3-sonnet",
    llmFallbacks: ["gpt-4", "claude-3-haiku"],
    harness: "ClawdBot",
    skills: ["unit-testing", "integration-testing", "e2e-testing", "jest", "playwright"],
    mcps: ["filesystem", "github"],
    clis: ["jest", "playwright", "vitest"],
    version: "1.2.3",
    config: {
      runtime: "ClawdBot",
      primaryModel: "claude-3-sonnet",
      capabilities: ["test-generation", "coverage-analysis", "bug-detection"],
    },
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
    for (const bot of SAMPLE_BOTS) {
      await ctx.db.insert("botProfiles", bot);
    }
    
    console.log(`Seeded ${SAMPLE_BOTS.length} development profiles`);
    return { 
      seeded: SAMPLE_BOTS.length, 
      message: "Development profiles seeded successfully",
      slugs: SAMPLE_BOTS.map(b => b.slug),
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
