import { Mcp } from './types';

interface McpRowProps {
  mcp: Mcp;
}

export function McpRow({ mcp }: McpRowProps) {
  return (
    <div className="flex justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] p-2">
      <span className="text-xs font-bold">{mcp.name}</span>
      <span className="text-xs text-[var(--color-text-secondary)]">
        {mcp.version || 'UNKNOWN'}
      </span>
    </div>
  );
}
