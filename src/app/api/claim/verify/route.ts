import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexHttpClient(convexUrl || 'https://veracious-cow-331.convex.cloud');

/**
 * Fetch Gist content from GitHub API
 */
async function fetchGistContent(gistUrl: string): Promise<string> {
  // Extract gist ID from URL
  const match = gistUrl.match(/gist\.github\.com\/.+\/([a-f0-9]+)/);
  if (!match) {
    throw new Error('Invalid Gist URL');
  }
  
  const gistId = match[1];
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // Use GitHub token if available for higher rate limits
      ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Gist: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Concatenate all file contents
  let content = '';
  for (const file of Object.values(data.files || {})) {
    content += (file as any).content || '';
  }
  
  return content;
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
