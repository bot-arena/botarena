import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CRTBackground } from '@/components/CRTBackground';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: 'npx botarena — Showcase Your Bot!',
  description: 'Showcase your AI agent configurations. Generate beautiful bot profiles with one command.',
  authors: [{ name: 'BotArena' }],
  keywords: ['AI bots', 'ClawdBot', 'bot showcase', 'AI agents', 'bot configuration'],
  openGraph: {
    title: 'npx botarena — Showcase Your Bot!',
    description: 'Showcase your AI agent configurations in a beautiful, comparable format',
    type: 'website',
    siteName: 'BotArena',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'npx botarena — Showcase Your Bot!',
    description: 'Showcase your AI agent configurations in a beautiful, comparable format',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] antialiased">
        <div className="min-h-screen relative">
          <CRTBackground />
          <div className="relative z-10">
            <Navigation />
            <main className="pt-[60px] pb-[80px] md:pb-0 px-4">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
