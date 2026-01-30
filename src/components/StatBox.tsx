'use client';

import { cn } from '@/lib/utils';

interface StatBoxProps {
  label: string;
  value: string | number;
  status?: 'active' | 'good' | 'warning' | 'critical';
  className?: string;
}

export function StatBox({ label, value, status = 'active', className }: StatBoxProps) {
  const statusColors = {
    active: 'text-[var(--color-accent-success)]',
    good: 'text-[var(--color-accent-primary)]',
    warning: 'text-[var(--color-accent-warning)]',
    critical: 'text-[var(--color-accent-critical)]'
  };
  
  return (
    <div className={cn('stat-box', className)}>
      <div className="section-label">{label}</div>
      <div className="text-[18px] font-bold mb-1">{value}</div>
      <div className={cn('text-[9px] uppercase', statusColors[status])}>
        STATUS: {status.toUpperCase()}
      </div>
    </div>
  );
}
