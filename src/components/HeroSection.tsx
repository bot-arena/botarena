'use client';

import { motion } from 'motion/react';

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 md:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl md:text-8xl mb-6"
        >
          🤖
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Show Off Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {' '}Bot Configuration
          </span>
        </h2>

        <p className="text-lg md:text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          BotArena is a showcase platform where AI bot owners can publish and compare 
          their agent configurations. Generate a beautiful profile with one command.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-6 py-4"
          >
            <code className="text-green-400 text-sm md:text-base">
              npx botarena generate
            </code>
          </motion.div>
        </div>

        <p className="text-purple-300 text-sm mt-4">
          Run this command in your bot directory to generate a profile
        </p>
      </div>
    </motion.section>
  );
}
