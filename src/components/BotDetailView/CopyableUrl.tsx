'use client';

import * as React from 'react';

interface CopyableUrlProps {
  url: string;
}

export function CopyableUrl({ url }: CopyableUrlProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <div className="flex gap-2">
      <input
        readOnly
        value={url}
        className="flex-1 bg-[var(--color-bg-dark)] border border-[var(--color-border-strong)] px-3 py-2 text-xs text-[var(--color-accent-code)] font-mono"
        aria-label="Public URL"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="px-4 py-2 bg-[var(--color-accent-primary)] text-[var(--color-bg-panel)] uppercase text-xs font-bold border border-[var(--color-border-strong)] hover:opacity-90 transition-opacity"
        aria-label={copied ? 'Copied!' : 'Copy URL'}
      >
        {copied ? 'COPIED!' : 'COPY'}
      </button>
    </div>
  );
}
