import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema for BotArena
 * 
 * Defines the database structure for bot profiles with:
 * - Core identity fields (name, slug, description)
 * - LLM configuration (primary, fallbacks)
 * - Capabilities (harness, skills, mcps, clis)
 * - Full config storage for flexibility
 * 
 * Indexes:
 * - by_slug: Fast lookup by unique slug
 * - search_profiles: Full-text search on name with filters
 */

export default defineSchema({
  botProfiles: defineTable({
    // Core identity
    name: v.string(),
    slug: v.string(),
    description: v.string(), // "yearbook quote"
    avatar: v.optional(v.string()),
    
    // LLM configuration
    llmPrimary: v.string(),
    llmFallbacks: v.optional(v.array(v.string())),
    
    // Capabilities
    harness: v.string(),
    skills: v.array(v.string()),
    mcps: v.array(v.string()),
    clis: v.array(v.string()),
    version: v.string(),

    // Metadata
    createdAt: v.string(),
    updatedAt: v.string(),
    
    // Full config as JSON for flexibility
    config: v.any(),
  })
    .index("by_slug", ["slug"])
    .searchIndex("search_profiles", {
      searchField: "name",
      filterFields: ["harness", "llmPrimary"],
    }),
});
