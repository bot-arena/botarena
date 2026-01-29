import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

/**
 * Convex HTTP Actions
 * 
 * HTTP endpoints for external integrations (CLI uploads)
 * Runs on Convex infrastructure with global distribution
 */

const http = httpRouter();

/**
 * POST /api/profiles - Create profile from CLI
 * Accepts bot profile data and creates a new profile
 */
http.route({
  path: "/api/profiles",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      // Import API inside handler to avoid circular dependencies
      const { api } = await import("./_generated/api");
      
      // Call the mutation to create profile
      const profile = await ctx.runMutation(api.botProfiles.createProfile, {
        name: body.name,
        description: body.description,
        llmPrimary: body.llm?.primary || body.llmPrimary || "Not specified",
        llmFallbacks: body.llm?.fallbacks || body.llmFallbacks || [],
        harness: body.harness,
        skills: body.skills || [],
        mcps: body.mcps || [],
        clis: body.clis || [],
        version: body.version,
        config: body,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: profile,
          message: "Profile created successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error creating profile:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Failed to create profile",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

/**
 * GET /api/profiles/:slug - Get profile by slug
 * Returns profile data for a given slug
 */
http.route({
  path: "/api/profiles/{slug}",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.pathname.split("/").pop();

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: "Slug required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Import API inside handler
    const { api } = await import("./_generated/api");
    
    const profile = await ctx.runQuery(api.botProfiles.getBySlug, { slug });

    if (!profile) {
      return new Response(
        JSON.stringify({ success: false, error: "Profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: profile }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }),
});

/**
 * OPTIONS /api/profiles - CORS preflight
 * Handles CORS preflight requests
 */
http.route({
  path: "/api/profiles",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
