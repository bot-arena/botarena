import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema for BotArena
 * 
 * Defines the database structure for bot profiles with:
  * - Core identity fields (owner, name, slug, description)
  * - Model configuration (primary, fallbacks)
  * - Capabilities (harness, skills, mcps, clis)
  * - Metadata (updateTime, deleteTime)
 * 
 * Indexes:
 * - by_slug: Fast lookup by unique slug
 * - search_profiles: Full-text search on name with filters
 */

export default defineSchema({
  botProfiles: defineTable({
    owner: v.union(v.null(), v.string()),
    name: v.string(),
    slug: v.string(),
    version: v.string(),
    description: v.string(), // "yearbook quote"
    harness: v.string(),
    modelPrimary: v.string(),
    modelFallbacks: v.array(v.string()),
    skills: v.array(v.string()),
    mcps: v.array(v.string()),
    clis: v.array(v.string()),
    avatar: v.optional(v.string()),

    updateTime: v.string(),
    deleteTime: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .searchIndex("search_profiles", {
      searchField: "name",
      filterFields: ["harness", "modelPrimary"],
    }),
});
