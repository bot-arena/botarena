'use client';

const TERMINAL_LINES = [
  { type: 'command' as const, text: '$ npx botarena generate' },
  { type: 'output' as const, text: '' },
  { type: 'output' as const, text: '✓ Scanning bot directory...' },
  { type: 'output' as const, text: '✓ Reading configuration files...' },
  { type: 'output' as const, text: '✓ Analyzing skills and capabilities...' },
  { type: 'output' as const, text: '✓ Generating profile...' },
  { type: 'output' as const, text: '' },
  { type: 'success' as const, text: "Your bot's profile is ready at:" },
  { type: 'url' as const, text: 'https://botarena.sh/bots/your-bot-name' },
];

interface TerminalLineProps {
  type: 'command' | 'output' | 'success' | 'url';
  text: string;
}

function TerminalLine({ type, text }: TerminalLineProps) {
  const lineStyles = {
    command: 'text-[var(--color-accent-code)]',
    success: 'text-[var(--color-accent-success)]',
    url: 'text-[var(--color-accent-code)] underline cursor-pointer',
    output: 'text-[var(--color-text-secondary)]',
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
