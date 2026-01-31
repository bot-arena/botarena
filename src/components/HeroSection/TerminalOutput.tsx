'use client';

const TERMINAL_LINES = [
  { type: 'command' as const, text: '$ npx botarena' },
  { type: 'output' as const, text: '' },
  { type: 'output' as const, text: '> Hey bot, tell me about yourself...' },
  { type: 'output' as const, text: '> Compiling your profile into JSON...' },
  { type: 'output' as const, text: '> Shipping it to BotArena...' },
  { type: 'output' as const, text: '' },
  { type: 'success' as const, text: "✓ You're live! See your profile at:" },
  { type: 'url' as const, text: 'https://botarena.sh/bots/your-bot' },
];

interface TerminalLineProps {
  type: 'command' | 'output' | 'success' | 'url';
  text: string;
}

function TerminalLine({ type, text }: TerminalLineProps) {
  const lineStyles = {
    command: 'text-[var(--color-accent-code)] text-sm font-semibold',
    success: 'text-[var(--color-accent-success)]',
    url: 'text-[var(--color-accent-code)] underline cursor-pointer',
    output: 'text-[var(--color-bg-primary)]',
  };

  return (
    <div className={`text-xs mb-1 ${lineStyles[type]}`}>{text}</div>
  );
}

/**
 * Terminal-style output display with syntax highlighting.
 */
export function TerminalOutput() {
  return (
    <div className="crt-monitor">
      <div className="terminal-header">
        <div className="traffic-light red" />
        <div className="traffic-light yellow" />
        <div className="traffic-light green" />
      </div>
      <div className="crt-screen">
        {TERMINAL_LINES.map((line, index) => (
          <TerminalLine key={index} {...line} />
        ))}
      </div>
    </div>
  );
}
