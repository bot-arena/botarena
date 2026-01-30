'use client';

import * as React from 'react';

const BOT_TYPES = ['CLAWDBOTS', 'MOLTBOTS', 'OPENBOTS'] as const;
const TYPE_SPEED_MS = 100;
const DELETE_SPEED_MS = 50;
const PAUSE_DURATION_MS = 2000;

/**
 * Typewriter effect headline that cycles through bot types.
 */
export function AnimatedHeadline() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  const typeNextChar = React.useCallback(() => {
    const currentWord = BOT_TYPES[currentIndex];
    if (displayText.length < currentWord.length) {
      setDisplayText(currentWord.slice(0, displayText.length + 1));
    } else {
      setIsPaused(true);
    }
  }, [currentIndex, displayText]);

  const deleteLastChar = React.useCallback(() => {
    if (displayText.length > 0) {
      setDisplayText((prev) => prev.slice(0, -1));
    } else {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % BOT_TYPES.length);
    }
  }, [displayText]);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isPaused) {
      timeoutId = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, PAUSE_DURATION_MS);
    } else if (isDeleting) {
      timeoutId = setTimeout(deleteLastChar, DELETE_SPEED_MS);
    } else {
      timeoutId = setTimeout(typeNextChar, TYPE_SPEED_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [isDeleting, isPaused, displayText, typeNextChar, deleteLastChar]);

  return (
    <h1 className="text-xl font-bold uppercase mb-2">
      SHOWCASE YOUR{' '}
      <span className="inline-block min-w-[140px]">
        {displayText}
        <span className="cursor-blink" aria-hidden="true" />
      </span>
    </h1>
  );
}
