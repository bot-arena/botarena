import { Panel } from '@/components/Panel';
import { Mcp } from './types';

interface McpRowProps {
  mcp: Mcp;
}

export function McpRow({ mcp }: McpRowProps) {
  return (
    <Panel className="flex justify-between p-2">
      <span className="text-xs font-bold">{mcp.name}</span>
      <span className="text-xs text-[var(--color-text-secondary)]">
        {mcp.version || 'UNKNOWN'}
      </span>
    </Panel>
  );
}
