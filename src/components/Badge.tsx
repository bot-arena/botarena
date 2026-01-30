'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function Badge({ children, active = false, className }: BadgeProps) {
  const activeClasses = active ? 'badge-active' : 'badge-inactive';
  
  return (
    <span className={cn('badge-retro', activeClasses, className)}>
      {children}
    </span>
  );
}
