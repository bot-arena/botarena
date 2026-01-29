'use client';

import { motion } from 'motion/react';

interface BotProfile {
  _id: string;
  slug: string;
  name: string;
  description: string;
  llmPrimary: string;
  llmFallbacks?: string[];
  harness: string;
  skills: string[];
  mcps: string[];
  clis: string[];
  version: string;
  _creationTime: number;
  config?: {
    llm?: {
      primary: string;
      fallbacks?: string[];
    };
    skills?: string[];
    mcps?: string[];
    clis?: string[];
    harness?: string;
    version?: string;
  };
}

interface ProfileViewProps {
  profile: BotProfile;
}

export function ProfileView({ profile }: ProfileViewProps) {
  // Extract config from profile or use profile fields directly
  const config = profile.config || {
    llm: {
      primary: profile.llmPrimary,
      fallbacks: profile.llmFallbacks || [],
    },
    skills: profile.skills,
    mcps: profile.mcps,
    clis: profile.clis,
    harness: profile.harness,
    version: profile.version,
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - AI Bot Profile`,
          url: window.location.href,
          text: profile.description,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Could add toast notification here
    } catch {
      // Clipboard failed
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        {/* Bot Avatar/Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">🤖</span>
        </div>

        {/* Bot Name and Self-Description */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {profile.name}
        </h1>

        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-xl text-purple-200 italic">"{profile.description}"</p>
          <p className="text-sm text-purple-300 mt-2">— {profile.name}&apos;s yearbook quote</p>
        </div>

        {/* Share Buttons */}
        <div className="flex justify-center gap-4">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleShare}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Share Profile
            </button>
          )}
          <button
            onClick={handleCopyLink}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </motion.div>

      {/* Configuration Details */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Core Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">⚙️ Core Configuration</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-purple-300 uppercase">Primary LLM</div>
              <div className="text-lg font-semibold text-white">{config.llm?.primary || profile.llmPrimary}</div>
            </div>

            {config.llm?.fallbacks && config.llm.fallbacks.length > 0 && (
              <div>
                <div className="text-sm text-purple-300 uppercase">Fallback LLMs</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {config.llm.fallbacks.map((llm: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm"
                    >
                      {llm}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-purple-300 uppercase">Runtime Harness</div>
              <div className="text-lg font-semibold text-white">{config.harness || profile.harness}</div>
            </div>

            <div>
              <div className="text-sm text-purple-300 uppercase">Version</div>
              <div className="text-lg font-semibold text-white">{config.version || profile.version}</div>
            </div>
          </div>
        </motion.div>

        {/* Capabilities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Capabilities</h2>

          <div className="space-y-6">
            {/* Skills */}
            {config.skills && config.skills.length > 0 && (
              <div>
                <div className="text-sm text-purple-300 uppercase mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {config.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MCPs */}
            {config.mcps && config.mcps.length > 0 && (
              <div>
                <div className="text-sm text-purple-300 uppercase mb-2">Model Context Protocols</div>
                <div className="flex flex-wrap gap-2">
                  {config.mcps.map((mcp: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm"
                    >
                      {mcp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CLIs */}
            {config.clis && config.clis.length > 0 && (
              <div>
                <div className="text-sm text-purple-300 uppercase mb-2">Command Line Tools</div>
                <div className="flex flex-wrap gap-2">
                  {config.clis.map((cli: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-full text-sm"
                    >
                      {cli}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16">
        <p className="text-purple-300">
          Profile created on {new Date(profile._creationTime).toLocaleDateString()}
        </p>
        <p className="text-sm text-purple-400 mt-2">
          Generated with <span className="text-white font-semibold">npx botarena</span>
        </p>
      </div>
    </div>
  );
}
