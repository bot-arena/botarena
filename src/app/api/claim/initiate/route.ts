import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexHttpClient(convexUrl || 'https://veracious-cow-331.convex.cloud');

/**
 * POST /api/claim/initiate
 * Initiate a claim for a bot profile
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, gistUrl, githubHandle } = body;

    if (!slug || !gistUrl || !githubHandle) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug, gistUrl, githubHandle' },
        { status: 400 }
      );
    }

    const result = await convex.mutation(api.botProfiles.initiateClaim, {
      slug,
      gistUrl,
      githubHandle,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Claim initiation failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initiate claim' },
      { status: 500 }
    );
  }
}
