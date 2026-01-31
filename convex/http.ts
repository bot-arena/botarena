import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

/**
 * Convex HTTP Actions
 * 
 * HTTP endpoints for external integrations (CLI uploads)
 * Runs on Convex infrastructure with global distribution
 */

const http = httpRouter();
const MODEL_PATTERN = /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i;

const isValidModel = (value: unknown): value is string =>
  typeof value === "string" && MODEL_PATTERN.test(value);

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
      
      const modelPrimary = body.modelPrimary ?? body.llm?.primary;
      const modelFallbacks = body.modelFallbacks ?? body.llm?.fallbacks ?? [];

      const owner = typeof body.owner === "string" && body.owner.trim()
        ? body.owner.trim()
        : null;

      if (!isValidModel(modelPrimary)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "modelPrimary must match provider/model",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!Array.isArray(modelFallbacks) || modelFallbacks.some((model) => !isValidModel(model))) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "modelFallbacks must be an array of provider/model strings",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Call the mutation to create profile
      const profile = await ctx.runMutation(api.botProfiles.createProfile, {
        owner,
        name: body.name,
        description: body.description,
        avatar: body.avatar,
        modelPrimary,
        modelFallbacks,
        harness: body.harness,
        skills: body.skills || [],
        mcps: body.mcps || [],
        clis: body.clis || [],
        version: body.version || "1.0.0",
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
  pathPrefix: "/api/profiles/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const slug = pathSegments[pathSegments.length - 1];

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

/**
 * POST /api/seed - Seed development profiles
 * Only available in development environment
 * Populates database with sample bot profiles
 */
http.route({
  path: "/api/seed",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Check for development environment
      // In Convex, we check the deployment URL or a custom header
      const isDev = request.headers.get("x-environment") === "development" ||
                    process.env.CONVEX_ENV === "dev";
      
      if (!isDev) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Seed endpoint only available in development" 
          }),
          {
            status: 403,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Import API inside handler
      const { api } = await import("./_generated/api");

      // Run seed mutation
      const result = await ctx.runMutation(api.seed.seedDevProfiles, {});

      return new Response(
        JSON.stringify({
          success: true,
          data: result,
          message: result.seeded > 0 
            ? `Seeded ${result.seeded} development profiles`
            : result.message,
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
      console.error("Error seeding profiles:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Failed to seed profiles",
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }),
});

/**
 * POST /api/seed/clear - Clear all development profiles
 * Only available in development environment
 */
http.route({
  path: "/api/seed/clear",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Check for development environment
      const isDev = request.headers.get("x-environment") === "development" ||
                    process.env.CONVEX_ENV === "dev";
      
      if (!isDev) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Clear endpoint only available in development" 
          }),
          {
            status: 403,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Import API inside handler
      const { api } = await import("./_generated/api");

      // Run clear mutation
      const result = await ctx.runMutation(api.seed.clearDevProfiles, {});

      return new Response(
        JSON.stringify({
          success: true,
          data: result,
          message: result.message,
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
      console.error("Error clearing profiles:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Failed to clear profiles",
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }),
});

/**
 * GET /api/seed/status - Check seed status
 * Returns current database state
 */
http.route({
  path: "/api/seed/status",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      // Import API inside handler
      const { api } = await import("./_generated/api");

      // Get seed status
      const result = await ctx.runMutation(api.seed.getSeedStatus, {});

      return new Response(
        JSON.stringify({
          success: true,
          data: result,
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
      console.error("Error checking seed status:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Failed to check status",
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }),
});

/**
 * OPTIONS /api/seed - CORS preflight for seed endpoints
 */
http.route({
  path: "/api/seed",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-environment",
      },
    });
  }),
});

export default http;
