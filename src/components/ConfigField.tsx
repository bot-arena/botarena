'use client';

import { cn } from '@/lib/utils';

interface ConfigFieldProps {
  label: string;
  value: string | number | string[];
  className?: string;
}

export function ConfigField({ label, value, className }: ConfigFieldProps) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  
  return (
    <div className={cn('flex justify-between border-b border-[var(--color-border-weak)] py-1', className)}>
      <span className="text-[10px] uppercase text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-[10px] font-bold max-w-[60%] truncate">{displayValue}</span>
    </div>
  );
}
