import { ConvexReactClient } from "convex/react";

/**
 * Convex React Client
 * 
 * Public client for web app (read access via queries)
 * Requires NEXT_PUBLIC_CONVEX_URL environment variable
 */

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn(
    "NEXT_PUBLIC_CONVEX_URL is not set. " +
    "Convex features will not work. " +
    "Run 'npx convex dev' to get your Convex URL."
  );
}

export const convex = new ConvexReactClient(convexUrl || "");
