import { Server } from 'lucide-react';
import { Mcp } from './types';

interface McpRowProps {
  mcp: Mcp;
}

/**
 * Compact inline MCP badge that fits around the MCP name.
 * Displays MCP name with Server icon in a tight, badge-like format.
 */
export function McpRow({ mcp }: McpRowProps) {
  // Handle string MCPs (backward compatibility)
  if (typeof mcp === 'string') {
    return (
      <div className="badge-inline badge-inline-mcp">
        <div className="badge-icon">
          <Server aria-hidden="true" />
        </div>
        <span className="badge-name">{mcp}</span>
      </div>
    );
  }

  return (
    <div className="badge-inline badge-inline-mcp">
      <div className="badge-icon">
        <Server aria-hidden="true" />
      </div>
      <span className="badge-name">{mcp.name}</span>
      {mcp.version && (
        <span className="badge-version">{mcp.version}</span>
      )}
    </div>
  );
}
