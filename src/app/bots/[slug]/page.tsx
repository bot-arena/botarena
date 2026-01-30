import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BotDetailView } from '@/components/BotDetailView';

interface BotProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: BotProfilePageProps
): Promise<Metadata> {
  const { slug } = await params;
  
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
  
  return <BotDetailView profile={profile} />;
}

export async function generateStaticParams() {
  return [];
}
