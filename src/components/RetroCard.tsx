'use client';

import { cn } from '@/lib/utils';

interface RetroCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function RetroCard({ children, className, onClick, href }: RetroCardProps) {
  const baseClasses = 'retro-card';
  const interactiveClasses = onClick || href ? 'cursor-pointer hover:translate-y-[-2px]' : '';
  
  if (href) {
    return (
      <a href={href} className={cn(baseClasses, interactiveClasses, className)}>
        {children}
      </a>
    );
  }
  
  return (
    <div onClick={onClick} className={cn(baseClasses, interactiveClasses, className)}>
      {children}
    </div>
  );
}
