import React from 'react';
import { Inbox, PlusCircle, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-dashed border-slate-800 rounded-3xl overflow-hidden group ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 flex items-center justify-center text-emerald-400 mb-4 shadow-xl ring-1 ring-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-100 font-heading mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} leftIcon={<PlusCircle className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
