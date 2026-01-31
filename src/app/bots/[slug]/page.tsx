'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { BotDetailView } from '@/components/BotDetailView';

interface BotProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const normalizeProfile = (profile: any) => {
  if (!profile || typeof profile !== 'object') return profile;

  const llmConfig = profile.llm ?? {};
  const llm = {
    primary:
      llmConfig.primary ??
      llmConfig.modelPrimary ??
      profile.modelPrimary ??
      profile.llmPrimary ??
      'UNKNOWN',
    fallbacks:
      llmConfig.fallbacks ??
      llmConfig.modelFallbacks ??
      profile.modelFallbacks ??
      profile.llmFallbacks ??
      [],
  };

  const normalizeDate = (value: unknown) => {
    if (!value) return undefined;
    if (typeof value === 'number') return new Date(value).toISOString();
    return value;
  };

  const createdAt = normalizeDate(profile._creationTime ?? profile.createdAt);
  const updatedAt = normalizeDate(
    profile.updateTime ?? profile.updatedAt ?? profile._creationTime ?? profile.createdAt
  );

  return {
    ...profile,
    id: profile._id ?? profile.id,
    llm,
    createdAt,
    updatedAt,
  };
};

export default function BotProfilePage({ params }: BotProfilePageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { slug } = await params;
        const apiUrl =
          process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
          process.env.NEXT_PUBLIC_CONVEX_URL ||
          '';
        
        const response = await fetch(`${apiUrl}/api/profiles/${slug}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          setError(true);
          return;
        }

        const result = await response.json();
        const normalizedProfile = normalizeProfile(result.data);

        if (!normalizedProfile) {
          setError(true);
          return;
        }

        setProfile(normalizedProfile);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    notFound();
  }

  return <BotDetailView profile={profile} />;
}

export const dynamic = 'force-static';
export const dynamicParams = true;
