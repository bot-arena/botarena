import { Terminal } from 'lucide-react';
import { Cli } from './types';

interface CliBadgeProps {
  cli: Cli;
}

/**
 * Beautiful CLI badge component with retro gaming aesthetic.
 * Displays CLI name with Terminal icon in a compact grid-friendly format.
 */
export function CliBadge({ cli }: CliBadgeProps) {
  // Handle string CLIs (backward compatibility)
  if (typeof cli === 'string') {
    return (
      <div className="badge-beautiful badge-cli badge-cli-simple">
        <div className="badge-icon">
          <Terminal aria-hidden="true" />
        </div>
        <span className="badge-name">{cli}</span>
      </div>
    );
  }

  return (
    <div className="badge-beautiful badge-cli badge-cli-simple">
      <div className="badge-icon">
        <Terminal aria-hidden="true" />
      </div>
      <span className="badge-name">{cli.name}</span>
    </div>
  );
}
