import React from 'react';
import { cn } from '../../lib/utils';

interface StatusDotProps {
  status: 'normal' | 'warning' | 'critical' | 'inactive';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  pulse = false,
  size = 'md',
  className,
}) => {
  const colorMap = {
    normal: 'bg-emerald-500 shadow-glow-green',
    warning: 'bg-amber-500 shadow-glow-amber',
    critical: 'bg-rose-500 shadow-glow-red',
    inactive: 'bg-slate-500',
  };

  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {pulse && status !== 'inactive' && (
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            colorMap[status]
          )}
        />
      )}
      <span className={cn('relative inline-flex rounded-full', sizeMap[size], colorMap[status])} />
    </span>
  );
};
