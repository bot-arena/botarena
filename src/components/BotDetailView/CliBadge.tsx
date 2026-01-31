import { Terminal } from 'lucide-react';
import { Cli } from './types';

interface CliBadgeProps {
  cli: Cli;
}

/**
 * Compact inline CLI badge that fits around the CLI name.
 * Displays CLI name with Terminal icon in a tight, badge-like format.
 */
export function CliBadge({ cli }: CliBadgeProps) {
  // Handle string CLIs (backward compatibility)
  if (typeof cli === 'string') {
    return (
      <div className="badge-inline badge-inline-cli">
        <div className="badge-icon">
          <Terminal aria-hidden="true" />
        </div>
        <span className="badge-name">{cli}</span>
      </div>
    );
  }

  return (
    <div className="badge-inline badge-inline-cli">
      <div className="badge-icon">
        <Terminal aria-hidden="true" />
      </div>
      <span className="badge-name">{cli.name}</span>
    </div>
  );
}
