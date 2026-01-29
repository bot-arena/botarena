"use client";

import { ConvexProvider } from "convex/react";
import { convex } from "../lib/convex";
import { ReactNode } from "react";

/**
 * Convex Providers
 * 
 * Wraps the application with ConvexProvider for reactive queries
 * Must be used in a client component
 */

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
