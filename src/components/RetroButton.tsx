'use client';

import { cn } from '@/lib/utils';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function RetroButton({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  className,
  variant = 'primary'
}: RetroButtonProps) {
  const baseClasses = 'btn-retro';
  const variantClasses = variant === 'primary' 
    ? '' 
    : 'bg-[var(--color-bg-secondary)]';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses, disabledClasses, className)}
    >
      {children}
    </button>
  );
}
