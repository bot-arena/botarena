import { Metadata } from 'next';
import { BotProfileClient } from './BotProfileClient';

interface BotProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Export empty array for static export - all bot pages will be generated on-demand
export async function generateStaticParams() {
  return [];
}

// Force static generation
export const dynamic = 'force-static';

export async function generateMetadata(
  { params }: BotProfilePageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  const apiUrl =
    process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
    process.env.NEXT_PUBLIC_CONVEX_URL ||
    '';
    
  try {
    const response = await fetch(`${apiUrl}/api/profiles/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return {
        title: 'Bot Not Found | BotArena',
        description: 'This bot profile could not be found.',
      };
    }
    
    const result = await response.json();
    const profile = result.data;
    
    return {
      title: `${profile.name} | BotArena`,
      description: profile.description,
      openGraph: {
        title: `${profile.name} - AI Bot Profile`,
        description: profile.description,
        url: `https://botarena.sh/bots/${profile.slug}`,
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profile.name} - AI Bot Profile`,
        description: profile.description,
      },
    };
  } catch {
    return {
      title: 'Bot Not Found | BotArena',
      description: 'This bot profile could not be found.',
    };
  }
}

export default async function BotProfilePage({ params }: BotProfilePageProps) {
  const { slug } = await params;
  return <BotProfileClient slug={slug} />;
}
