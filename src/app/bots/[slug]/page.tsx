import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileView } from '@/components/ProfileView';

interface BotProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: BotProfilePageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch profile from Convex HTTP API
  const apiUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';
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
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${profile.name} AI Bot Profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name} - AI Bot Profile`,
      description: profile.description,
    },
  };
}

export default async function BotProfilePage({ params }: BotProfilePageProps) {
  const { slug } = await params;
  
  // Fetch profile from Convex HTTP API
  const apiUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';
  const response = await fetch(`${apiUrl}/api/profiles/${slug}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    notFound();
  }
  
  const result = await response.json();
  const profile = result.data;
  
  if (!profile) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <ProfileView profile={profile} />
    </div>
  );
}

// Generate static paths for known profiles (optional optimization)
export async function generateStaticParams() {
  // For now, return empty to generate on-demand
  // In future, fetch from Convex to pre-generate popular profiles
  return [];
}
