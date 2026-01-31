import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

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
 * Uses document ID as slug until claim flow updates it
 */
export const createProfile = mutation({
  args: {
    owner: v.optional(v.union(v.null(), v.string())),
    name: v.string(),
    description: v.string(),
    avatar: v.optional(v.string()),
    modelPrimary: v.string(),
    modelFallbacks: v.optional(v.array(v.string())),
    harness: v.string(),
    skills: v.array(v.string()),
    mcps: v.array(v.string()),
    clis: v.array(v.string()),
    version: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const profileId = await ctx.db.insert("botProfiles", {
      owner: args.owner ?? null,
      name: args.name,
      slug: "pending",
      version: args.version,
      description: args.description,
      harness: args.harness,
      modelPrimary: args.modelPrimary,
      modelFallbacks: args.modelFallbacks ?? [],
      skills: args.skills,
      mcps: args.mcps,
      clis: args.clis,
      ...(args.avatar ? { avatar: args.avatar } : {}),
      updateTime: now,
    });

    await ctx.db.patch(profileId, { slug: profileId });

    // Return the created profile
    return await ctx.db.get(profileId);
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
    avatar: v.optional(v.string()),
    deleteTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updateTime: new Date().toISOString(),
    });
    return await ctx.db.get(id);
  },
});

/**
 * Query: List profiles with pagination, search, filter, and sort
 * Supports cursor-based pagination for efficient infinite scroll
 */
export const listProfilesPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    harness: v.optional(v.string()),
    sortBy: v.optional(v.union(v.literal("updated"), v.literal("name"), v.literal("skills"))),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, searchQuery, harness, sortBy } = args;
    
    // Normalize search query for case-insensitive filtering
    const normalizedSearch = searchQuery?.toLowerCase().trim();
    const normalizedHarness = harness?.toLowerCase().trim();
    
    // Determine sort order
    const sortField = sortBy ?? "updated";
    
    // Fetch profiles with filtering
    let profiles = await ctx.db
      .query("botProfiles")
      .order(sortField === "name" ? "asc" : "desc")
      .collect();
    
    // Apply search filter (case-insensitive substring match on name)
    if (normalizedSearch) {
      profiles = profiles.filter((p) =>
        p.name.toLowerCase().includes(normalizedSearch)
      );
    }
    
    // Apply harness filter
    if (normalizedHarness && normalizedHarness !== "all") {
      profiles = profiles.filter((p) =>
        p.harness.toLowerCase() === normalizedHarness
      );
    }
    
    // Apply skills sort (sort by skills count, descending)
    if (sortField === "skills") {
      profiles = profiles.sort((a, b) => b.skills.length - a.skills.length);
    } else if (sortField === "name") {
      // Already sorted by name ascending from the query
      profiles = profiles.sort((a, b) => a.name.localeCompare(b.name));
    }
    // For "updated", we use the default desc order from the query
    
    // Manual pagination since we're doing in-memory filtering
    const { cursor, numItems } = paginationOpts;
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const endIndex = startIndex + numItems;
    const pageItems = profiles.slice(startIndex, endIndex);
    const hasMore = endIndex < profiles.length;
    const nextCursor = hasMore ? String(endIndex) : String(startIndex + pageItems.length);
    
    return {
      page: pageItems,
      continueCursor: nextCursor,
      isDone: !hasMore,
    };
  },
});
