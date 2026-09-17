import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface BudgetProgressProps {
  spent: number | string;
  limit: number | string;
  remaining?: number | string;
  percentage?: number;
  isExceeded?: boolean;
  currency?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  limit,
  remaining,
  percentage,
  isExceeded,
  currency = 'USD',
  showDetails = true,
  compact = false,
}) => {
  const numSpent = typeof spent === 'string' ? parseFloat(spent) || 0 : spent || 0;
  const numLimit = typeof limit === 'string' ? parseFloat(limit) || 0 : limit || 0;
  
  const calculatedPercent = numLimit > 0 ? (numSpent / numLimit) * 100 : 0;
  const pct = percentage !== undefined ? percentage : calculatedPercent;
  const clampedPct = Math.min(Math.max(pct, 0), 100);

  const numRemaining = remaining !== undefined
    ? (typeof remaining === 'string' ? parseFloat(remaining) || 0 : remaining)
    : numLimit - numSpent;

  const exceeded = isExceeded !== undefined ? isExceeded : numSpent > numLimit;
  const isNearLimit = !exceeded && pct >= 80;

  // Determine progress bar and badge colors
  let progressColor = 'bg-emerald-500 shadow-sm shadow-emerald-500/30';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let statusText = 'On Track';
  let StatusIcon = CheckCircle2;

  if (exceeded) {
    progressColor = 'bg-rose-500 shadow-sm shadow-rose-500/30';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    statusText = 'Over Budget';
    StatusIcon = ShieldAlert;
  } else if (isNearLimit) {
    progressColor = 'bg-amber-500 shadow-sm shadow-amber-500/30';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    statusText = 'Near Limit';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="space-y-2.5 w-full">
      {/* Visual Progress Bar Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            {formatCurrency(numSpent, currency)}
          </span>
          <span className="text-slate-400 font-medium">/</span>
          <span className="text-slate-400 font-medium">
            {formatCurrency(numLimit, currency)}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeBg}`}>
          <StatusIcon className="w-3 h-3 shrink-0" />
          <span>{pct.toFixed(0)}%</span>
          <span className="hidden sm:inline">({statusText})</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div 
        className="w-full h-2.5 rounded-full bg-slate-950/80 border border-slate-800/80 overflow-hidden p-0.5"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Budget usage: ${pct.toFixed(0)}% used`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
          style={{ width: `${clampedPct}%` }}
        />
      </div>

      {/* Detailed Breakdown */}
      {showDetails && !compact && (
        <div className="flex items-center justify-between text-xs pt-0.5 text-slate-400">
          <div>
            <span>Spent: </span>
            <span className={`font-mono font-medium ${exceeded ? 'text-rose-400' : 'text-slate-300'}`}>
              {formatCurrency(numSpent, currency)}
            </span>
          </div>

          <div>
            <span>{numRemaining < 0 ? 'Over limit: ' : 'Remaining: '}</span>
            <span className={`font-mono font-medium ${numRemaining < 0 ? 'text-rose-400 font-bold' : isNearLimit ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatCurrency(Math.abs(numRemaining), currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
