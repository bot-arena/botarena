'use client';

import { cn } from '@/lib/utils';

interface FilterTagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterTag({ children, active = false, onClick, className }: FilterTagProps) {
  return (
    <button
      onClick={onClick}
      className={cn('filter-tag', active && 'active', className)}
    >
      {children}
    </button>
  );
}
