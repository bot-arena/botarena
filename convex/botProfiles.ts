import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Bot Profile Queries and Mutations
 * 
 * Query functions are reactive - they automatically re-run when data changes
 * Mutation functions run in transactions (ACID compliant)
 */

/**
 * Query: Get all profiles (reactive - auto-updates on changes)
 * Returns profiles ordered by creation date (newest first)
 */
export const listProfiles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("botProfiles")
      .order("desc")
      .take(args.limit ?? 12);
    return profiles;
  },
});

/**
 * Query: Get profile by slug (reactive)
 * Uses the by_slug index for fast lookup
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("botProfiles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return profile;
  },
});

/**
 * Query: Search profiles by name
 * Uses the search_profiles index for full-text search
 */
export const searchProfiles = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("botProfiles")
      .withSearchIndex("search_profiles", (q) =>
        q.search("name", args.searchQuery)
      )
      .take(20);
    return profiles;
  },
});

/**
 * Mutation: Create new profile (transaction - ACID compliant)
 * Generates unique slug and inserts profile
 */
export const createProfile = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    llmPrimary: v.string(),
    llmFallbacks: v.optional(v.array(v.string())),
    harness: v.string(),
    skills: v.array(v.string()),
    mcps: v.array(v.string()),
    clis: v.array(v.string()),
    version: v.string(),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    // Generate unique slug from name
    const baseSlug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Insert profile (entire function is a transaction)
    const profileId = await ctx.db.insert("botProfiles", {
      name: args.name,
      slug,
      description: args.description,
      llmPrimary: args.llmPrimary,
      llmFallbacks: args.llmFallbacks,
      harness: args.harness,
      skills: args.skills,
      mcps: args.mcps,
      clis: args.clis,
      version: args.version,
      config: args.config,
    });

    // Return the created profile
    const profile = await ctx.db.get(profileId);
    return profile;
  },
});

/**
 * Mutation: Update profile
 * Patches only the provided fields
 */
export const updateProfile = mutation({
  args: {
    id: v.id("botProfiles"),
    description: v.optional(v.string()),
    config: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});
