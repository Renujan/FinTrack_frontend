import React from 'react';
import Card from '../ui/Card';
import { Target, CheckCircle2, PauseCircle, Clock, Sparkles } from 'lucide-react';
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
      <Card className="!p-5 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Goals</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white font-heading">{summary.active_goals || 0}</span>
              <span className="text-xs text-slate-400">/ {summary.total_goals || 0} Total</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {summary.completed_goals || 0} Done
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <PauseCircle className="w-3.5 h-3.5" /> {summary.paused_goals || 0} Paused
          </span>
        </div>
      </Card>

      <Card className="!p-5 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Target</p>
            <p className="text-2xl font-extrabold text-white mt-1 font-heading">
              {formatCurrency(totalTarget, currency)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3 flex justify-between">
          <span>Overall Target Goal</span>
        </div>
      </Card>

      <Card className="!p-5 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Saved</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-heading">
              {formatCurrency(totalSaved, currency)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3 flex justify-between">
          <span className="font-semibold text-emerald-400">{progressPercent.toFixed(1)}% Achieved</span>
          <span className="text-slate-300 font-semibold">{formatCurrency(totalSaved, currency)}</span>
        </div>
      </Card>

      <Card className="!p-5 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1 font-heading">
              {formatCurrency(remaining, currency)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GoalSummaryCard;
