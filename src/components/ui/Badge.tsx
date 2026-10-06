import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'normal' | 'warning' | 'critical' | 'muted' | 'brand';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'muted',
  size = 'md',
  icon,
  ...props
}) => {
  const variantStyles = {
    normal: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    critical: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    muted: 'bg-surface-elevated text-slate-300 border-surface-border',
    brand: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider gap-1',
    md: 'text-xs px-2.5 py-1 tracking-wide gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium uppercase rounded-full border',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
