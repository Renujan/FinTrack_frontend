import React from 'react';
import Card from '../ui/Card';
import { Target, CheckCircle2, PauseCircle, Clock } from 'lucide-react';
import { GoalSummary } from '../../types/goal';
import { formatCurrency } from '../../utils/formatters';

interface GoalSummaryCardProps {
  summary: GoalSummary | null;
  currency?: string;
}

export const GoalSummaryCard: React.FC<GoalSummaryCardProps> = ({ summary, currency = 'USD' }) => {
  if (!summary) return null;

  const totalTarget = parseFloat(String(summary.total_target_amount || 0));
  const totalSaved = parseFloat(String(summary.total_saved_amount || 0));
  const remaining = parseFloat(String(summary.total_remaining_amount || 0));
  const progressPercent = summary.overall_progress_percentage || (totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="!p-4 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Goals</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{summary.active_goals || 0}</span>
              <span className="text-xs text-slate-400">/ {summary.total_goals || 0} Total</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {summary.completed_goals || 0} Done
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <PauseCircle className="w-3 h-3" /> {summary.paused_goals || 0} Paused
          </span>
        </div>
      </Card>

      <Card className="!p-4 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Target</p>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(totalTarget, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex justify-between">
          <span>Overall Savings Target</span>
        </div>
      </Card>

      <Card className="!p-4 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Saved</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {formatCurrency(totalSaved, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex justify-between">
          <span>{progressPercent.toFixed(1)}% Achieved</span>
          <span className="text-emerald-400 font-semibold">{formatCurrency(totalSaved, currency)}</span>
        </div>
      </Card>

      <Card className="!p-4 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {formatCurrency(remaining, currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GoalSummaryCard;
