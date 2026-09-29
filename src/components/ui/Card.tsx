import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  headerAction?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerAction,
  padding = 'md',
  onClick,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const actionNode = action || headerAction;

  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/80 border border-slate-800/90 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700/80 ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {(title || actionNode) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div>
            {title && <h3 className="text-lg font-bold text-white tracking-tight font-heading">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actionNode && <div>{actionNode}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
