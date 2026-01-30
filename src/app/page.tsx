'use client';

import { useState, useEffect, useCallback } from 'react';

import { BotCard } from '@/components/BotCard';
import Link from 'next/link';
import { Github } from 'lucide-react';

const botTypes = ['CLAWDBOTS', 'MOLTBOTS', 'OPENBOTS'];

function AnimatedHeadline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const typeNextChar = useCallback(() => {
    const currentWord = botTypes[currentIndex];
    if (displayText.length < currentWord.length) {
      setDisplayText(currentWord.slice(0, displayText.length + 1));
    } else {
      setIsPaused(true);
    }
  }, [currentIndex, displayText]);

  const deleteLastChar = useCallback(() => {
    if (displayText.length > 0) {
      setDisplayText((prev) => prev.slice(0, -1));
    } else {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % botTypes.length);
    }
  }, [displayText]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isPaused) {
      timeoutId = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting) {
      timeoutId = setTimeout(deleteLastChar, 50);
    } else {
      timeoutId = setTimeout(typeNextChar, 100);
    }

    return () => clearTimeout(timeoutId);
  }, [isDeleting, isPaused, displayText, typeNextChar, deleteLastChar]);

  return (
    <h1 className="text-[20px] font-bold uppercase mb-2">
      SHOWCASE YOUR{' '}
      <span className="inline-block min-w-[140px]">
        {displayText}
        <span className="cursor-blink"></span>
      </span>
    </h1>
  );
}

function TerminalOutput() {
  const outputLines = [
    { type: 'command', text: '$ npx botarena generate' },
    { type: 'output', text: '' },
    { type: 'output', text: '✓ Scanning bot directory...' },
    { type: 'output', text: '✓ Reading configuration files...' },
    { type: 'output', text: '✓ Analyzing skills and capabilities...' },
    { type: 'output', text: '✓ Generating profile...' },
    { type: 'output', text: '' },
    { type: 'success', text: "Your bot's profile is ready at:" },
    { type: 'url', text: 'https://botarena.sh/bots/your-bot-name' },
  ];

  return (
    <div className="crt-monitor">
      <div className="terminal-header">
        <div className="traffic-light red"></div>
        <div className="traffic-light yellow"></div>
        <div className="traffic-light green"></div>
      </div>
      <div className="crt-screen">
        {outputLines.map((line, index) => (
          <div
            key={index}
            className={`text-[11px] mb-1 ${line.type === 'command' ? 'text-[var(--color-accent-code)]' :
              line.type === 'success' ? 'text-[var(--color-accent-success)]' :
                line.type === 'url' ? 'text-[var(--color-accent-code)] underline cursor-pointer' :
                  'text-[var(--color-text-secondary)]'
              }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const mockBots = [
    {
      id: '1',
      slug: 'devbot-v1',
      name: 'DevBot-V1',
      harness: 'CLAWDBOT',
      version: '1.2.0',
      description: 'Building digital dreams, one commit at a time. Your personal coding companion.',
      skills: ['code-review', 'git-operations', 'debugging', 'testing', 'documentation', 'code-generation'],
      mcps: ['github', 'filesystem', 'terminal'],
      clis: ['docker', 'kubectl'],
      llm: { primary: 'GPT-4', fallbacks: ['GPT-3.5'] },
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      slug: 'research-assistant',
      name: 'Research-Assistant',
      harness: 'CLAWDBOT',
      version: '2.0.1',
      description: 'Turning chaos into clarity. Knowledge management for the curious mind.',
      skills: ['summarization', 'citation', 'analysis', 'note-taking'],
      mcps: ['notion', 'arxiv', 'web-search'],
      clis: [],
      llm: { primary: 'Claude-3', fallbacks: ['Claude-2'] },
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      slug: 'data-wizard',
      name: 'Data-Wizard',
      harness: 'CLAWDBOT',
      version: '0.9.5',
      description: 'Making data dance. Transform your raw information into insights.',
      skills: ['etl', 'visualization', 'analysis', 'ml-pipelines', 'data-cleaning', 'reporting'],
      mcps: ['postgres', 'redis', 's3'],
      clis: ['airflow', 'dbt'],
      llm: { primary: 'Llama-3', fallbacks: ['Llama-2'] },
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="space-y-0 max-w-7xl mx-auto">
      <section className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col justify-center">
            <AnimatedHeadline />
            <h2 className="text-[14px] text-[var(--color-text-primary)] mb-4">
              Spent hours configuring your bot with models, skills, MCPs, CLIs? Save a versioned profile on botarena.sh and show it to the world.
            </h2>
            <a
              href="https://github.com/botarena/botarena"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-retro inline-flex items-center gap-2 self-start"
            >
              <Github size={14} />
              <span>View on GitHub</span>
            </a>
          </div>
          <div className="p-8">

            <TerminalOutput />
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-[14px] font-bold uppercase mb-4">HOW IT WORKS</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="retro-card flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-accent-primary)] text-[var(--color-bg-panel)] border border-[var(--color-border-strong)] flex items-center justify-center font-bold text-[14px]">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">Command</h3>
                <p className="text-[12px] font-bold uppercase">Ask your bot to run npx botarena generate</p>
              </div>
            </div>
          </div>

          <div className="retro-card flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-accent-primary)] text-[var(--color-bg-panel)] border border-[var(--color-border-strong)] flex items-center justify-center font-bold text-[14px]">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">Processing</h3>
                <p className="text-[12px] font-bold uppercase">Botarena interviews its own setup. We never open your config!</p>
              </div>
            </div>
          </div>

          <div className="retro-card flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-accent-primary)] text-[var(--color-bg-panel)] border border-[var(--color-border-strong)] flex items-center justify-center font-bold text-[14px]">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">Result</h3>
                <p className="text-[12px] font-bold uppercase">Your bot's profile is live on botarena.sh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold uppercase">FEATURED_BOTS</h2>
          <Link href="/discover" className="text-[10px] uppercase text-[var(--color-accent-primary)]">
            VIEW_ALL &gt;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockBots.map((bot) => (
            <BotCard key={bot.id} profile={bot} />
          ))}
        </div>
      </section>
    </div>
  );
}
