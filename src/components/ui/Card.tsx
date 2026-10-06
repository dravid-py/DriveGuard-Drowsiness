import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'interactive';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface-card border border-surface-border',
    elevated: 'bg-surface-elevated border border-surface-border shadow-subtle',
    outline: 'bg-transparent border border-surface-border',
    interactive: 'bg-surface-card border border-surface-border hover:border-slate-600 transition-colors duration-150',
  };

  return (
    <div
      className={cn('rounded-xl p-5 md:p-6 text-slate-100', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
