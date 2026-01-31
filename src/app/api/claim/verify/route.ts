import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexHttpClient(convexUrl || 'https://veracious-cow-331.convex.cloud');

/**
 * Fetch Gist content from raw gist URL
 * Works for both public and secret gists - raw URLs are accessible to anyone with the link
 */
async function fetchGistContent(gistUrl: string): Promise<string> {
  // Extract user and gist ID from URL
  // URL format: https://gist.github.com/user/gist_id
  const match = gistUrl.match(/gist\.github\.com\/([^/]+)\/([a-f0-9]+)/);
  if (!match) {
    throw new Error('Invalid Gist URL format. Expected: https://gist.github.com/username/gist_id');
  }
  
  const [, user, gistId] = match;
  
  // Use raw gist URL - works for secret gists too!
  // Anyone with the gist URL can access the raw content
  const rawUrl = `https://gist.githubusercontent.com/${user}/${gistId}/raw`;
  
  const response = await fetch(rawUrl, {
    headers: {
      // Avoid GitHub's cache issues
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Gist not found. Make sure the URL is correct and the Gist exists.');
    }
    throw new Error(`Failed to fetch Gist: ${response.statusText}`);
  }

  return response.text();
}

/**
 * POST /api/claim/verify
 * Verify a claim by checking Gist content
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, githubHandle } = body;

    if (!slug || !githubHandle) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug, githubHandle' },
        { status: 400 }
      );
    }

    // Get claim status to find the Gist URL and verification code
    const claimStatus = await convex.query(api.botProfiles.getClaimStatus, { slug });
    
    if (!claimStatus || !claimStatus.hasPendingClaim) {
      return NextResponse.json(
        { success: false, error: 'No pending claim found' },
        { status: 400 }
      );
    }

    // Get profile to get the verification code
    const profile = await convex.query(api.botProfiles.getBySlug, { slug });
    
    if (!profile || !profile.claimGistUrl || !profile.claimVerificationCode) {
      return NextResponse.json(
        { success: false, error: 'Claim data not found' },
        { status: 400 }
      );
    }

    // Fetch Gist content
    const gistContent = await fetchGistContent(profile.claimGistUrl);
    
    // Verify the code is in the Gist
    if (!gistContent.includes(profile.claimVerificationCode)) {
      return NextResponse.json(
        { success: false, error: 'Verification code not found in Gist' },
        { status: 400 }
      );
    }

    // Verify the GitHub handle matches Gist owner
    const gistMatch = profile.claimGistUrl.match(/gist\.github\.com\/([^/]+)/);
    const gistOwner = gistMatch ? gistMatch[1] : null;
    
    if (gistOwner && gistOwner.toLowerCase() !== githubHandle.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'GitHub handle does not match Gist owner' },
        { status: 403 }
      );
    }

    // Finalize the claim
    const result = await convex.mutation(api.botProfiles.verifyClaim, {
      slug,
      githubHandle,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Claim verification failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify claim' },
      { status: 500 }
    );
  }
}
