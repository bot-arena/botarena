'use client';

import { motion } from 'motion/react';
import type { PublicBotConfigType } from '../schemas/bot-config';

interface ProfileCardProps {
  profile: PublicBotConfigType & { id?: string };
  onViewProfile?: () => void;
}

export function ProfileCard({ profile, onViewProfile }: ProfileCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
    >
      {/* Bot Avatar/Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl">🤖</span>
      </div>
      
      {/* Bot Name */}
      <h3 className="text-xl font-bold text-white text-center mb-2">
        {profile.name}
      </h3>
      
      {/* Self-Description */}
      <p className="text-purple-200 text-sm text-center mb-4 italic">
        &ldquo;{profile.description}&rdquo;
      </p>
      
      {/* Core Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xs text-purple-300 uppercase tracking-wider">LLM</div>
          <div className="text-sm font-semibold text-white truncate">{profile.llm.primary}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-300 uppercase tracking-wider">Harness</div>
          <div className="text-sm font-semibold text-white">{profile.harness}</div>
        </div>
      </div>
      
      {/* Skills and Capabilities */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 justify-center">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full border border-purple-500/30"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full border border-purple-500/30">
              +{profile.skills.length - 3}
            </span>
          )}
        </div>
      </div>
      
      {/* MCPs if present */}
      {profile.mcps && profile.mcps.length > 0 && (
        <div className="mt-3 pt-3 border-t border-purple-500/20">
          <div className="text-xs text-purple-300 uppercase tracking-wider text-center mb-2">MCPs</div>
          <div className="flex flex-wrap gap-1 justify-center">
            {profile.mcps.slice(0, 2).map((mcp, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-pink-500/20 text-pink-200 text-xs rounded-full border border-pink-500/30"
              >
                {mcp}
              </span>
            ))}
            {profile.mcps.length > 2 && (
              <span className="px-2 py-1 bg-pink-500/20 text-pink-200 text-xs rounded-full border border-pink-500/30">
                +{profile.mcps.length - 2}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Action Button */}
      <button
        onClick={onViewProfile}
        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200 font-medium"
      >
        View Profile
      </button>
    </motion.div>
  );
}
