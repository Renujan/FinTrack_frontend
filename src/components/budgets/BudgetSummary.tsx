import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { BudgetSummaryData } from '../../types/budget';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, TrendingUp, AlertTriangle, ShieldCheck, Wallet, ArrowUpRight } from 'lucide-react';

export interface BudgetSummaryProps {
  summary?: BudgetSummaryData | null;
  currency?: string;
  isLoading?: boolean;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  summary,
  currency = 'USD',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-7 w-32 bg-slate-800 rounded" />
            <div className="h-3 w-20 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const totalBudget = summary ? parseFloat(String(summary.total_budget_amount)) || 0 : 0;
  const totalSpent = summary ? parseFloat(String(summary.total_spent_amount)) || 0 : 0;
  const totalRemaining = summary ? parseFloat(String(summary.remaining_amount)) || 0 : totalBudget - totalSpent;
  const overallUtil = summary?.overall_utilization_percentage || (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);

  const activeCount = summary?.active_budgets || 0;
  const exceededCount = summary?.exceeded_budgets || 0;
  const nearLimitCount = summary?.budgets_near_limit || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Budgeted */}
      <Card className="relative overflow-hidden border-slate-800/80 bg-slate-900/90 hover:border-slate-700 transition">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Total Budgeted</p>
            <h4 className="text-2xl font-bold text-slate-100 tracking-tight">
              {formatCurrency(totalBudget, currency)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="font-medium text-slate-300">{activeCount}</span> active budget periods
        </div>
      </Card>

      {/* Total Spent */}
      <Card className="relative overflow-hidden border-slate-800/80 bg-slate-900/90 hover:border-slate-700 transition">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Total Spent</p>
            <h4 className="text-2xl font-bold text-slate-100 tracking-tight">
              {formatCurrency(totalSpent, currency)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">Usage rate:</span>
          <Badge
            variant={exceededCount > 0 ? 'danger' : overallUtil >= 80 ? 'warning' : 'success'}
            size="sm"
          >
            {overallUtil.toFixed(0)}%
          </Badge>
        </div>
      </Card>

      {/* Total Remaining */}
      <Card className="relative overflow-hidden border-slate-800/80 bg-slate-900/90 hover:border-slate-700 transition">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Total Remaining</p>
            <h4 className={`text-2xl font-bold tracking-tight ${totalRemaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(totalRemaining, currency)}
            </h4>
          </div>
          <div className={`p-2.5 rounded-xl border ${totalRemaining < 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400 truncate">
          {totalRemaining < 0 ? (
            <span className="text-rose-400 font-medium">Net budget exceeded</span>
          ) : (
            <span>Available across all limits</span>
          )}
        </div>
      </Card>

      {/* Budget Status Breakdown */}
      <Card className="relative overflow-hidden border-slate-800/80 bg-slate-900/90 hover:border-slate-700 transition">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Budget Health</p>
            <div className="flex items-center gap-2">
              {exceededCount > 0 ? (
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{exceededCount} Exceeded</span>
                </div>
              ) : nearLimitCount > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{nearLimitCount} Warning</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-lg">
                  <ShieldCheck className="w-5 h-5" />
                  <span>All Healthy</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{exceededCount} over limit</span>
          <span>•</span>
          <span>{nearLimitCount} near limit</span>
        </div>
      </Card>
    </div>
  );
};

export default BudgetSummary;
