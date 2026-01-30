'use client';

import * as React from 'react';

interface DebugToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function DebugToggle({ enabled, onChange }: DebugToggleProps) {
  const checkboxId = React.useId();

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={checkboxId}
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 border border-[var(--color-border-strong)]"
      />
      <label htmlFor={checkboxId} className="text-xs uppercase font-bold">
        DEBUG_MODE
      </label>
    </div>
  );
}
