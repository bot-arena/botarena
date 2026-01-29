import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BotArena - AI Bot Showcase Platform',
  description: 'Showcase your AI agent configurations in a beautiful, comparable format',
  authors: [{ name: 'BotArena Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              BotArena
            </h1>
            <p className="text-lg md:text-xl text-purple-200">
              Showcase Your AI Agent Configuration
            </p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
