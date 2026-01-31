import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

// Initialize Convex client
// We use NEXT_PUBLIC_CONVEX_URL which should be available in the environment
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('NEXT_PUBLIC_CONVEX_URL is not set in API route');
}
const convex = new ConvexHttpClient(convexUrl || 'https://veracious-cow-331.convex.cloud');

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields are present (basic check, schema validation handles details)
    if (!body.name || !body.description || !body.harness || !body.modelPrimary) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Convex mutation to create profile
    const result = await convex.mutation(api.botProfiles.createProfile, {
      owner: body.owner ?? null,
      name: body.name,
      description: body.description,
      avatar: body.avatar,
      harness: body.harness,
      modelPrimary: body.modelPrimary,
      modelFallbacks: body.modelFallbacks ?? [],
      skills: body.skills ?? [],
      mcps: body.mcps ?? [],
      clis: body.clis ?? [],
      version: body.version || "1.0.0",
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Profile creation failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
