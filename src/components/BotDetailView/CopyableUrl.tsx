'use client';

import * as React from 'react';
import { Input } from '@/components/Input';
import { RetroButton } from '@/components/RetroButton';

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
      <Input
        readOnly
        value={url}
        variant="light"
        className="flex-1"
        aria-label="Public URL"
      />
      <RetroButton
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy URL'}
      >
        {copied ? 'COPIED!' : 'COPY'}
      </RetroButton>
    </div>
  );
}
