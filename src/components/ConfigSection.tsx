'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfigSectionProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
}

export function ConfigSection({ title, children, expanded = false, className }: ConfigSectionProps) {
  const [isOpen, setIsOpen] = useState(expanded);
  
  return (
    <section className={cn('config-section', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="config-header"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="text-[10px]">{isOpen ? '[-]' : '[+]'}</span>
      </button>
      {isOpen && <div className="config-content">{children}</div>}
    </section>
  );
}
