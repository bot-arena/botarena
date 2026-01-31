import { Server } from 'lucide-react';
import { Mcp } from './types';

interface McpRowProps {
  mcp: Mcp;
}

/**
 * Beautiful MCP badge component with retro gaming aesthetic.
 * Displays MCP name, version, and optional transport with Server icon.
 */
export function McpRow({ mcp }: McpRowProps) {
  // Handle string MCPs (backward compatibility)
  if (typeof mcp === 'string') {
    return (
      <div className="badge-beautiful badge-mcp">
        <div className="badge-icon">
          <Server aria-hidden="true" />
        </div>
        <div className="badge-content">
          <div className="badge-header">
            <span className="badge-name">{mcp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="badge-beautiful badge-mcp">
      <div className="badge-icon">
        <Server aria-hidden="true" />
      </div>
      <div className="badge-content">
        <div className="badge-header">
          <span className="badge-name">{mcp.name}</span>
          {mcp.version && (
            <span className="badge-version">{mcp.version}</span>
          )}
        </div>

      </div>
    </div>
  );
}
