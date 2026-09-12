import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ShieldCheck, Activity, TrendingUp, PiggyBank } from 'lucide-react';
import { BalanceSummary, DashboardFinancialSummary } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';

export interface BalanceSavingsOverviewProps {
  balanceSummary?: BalanceSummary;
  summary?: DashboardFinancialSummary;
}

export const BalanceSavingsOverview: React.FC<BalanceSavingsOverviewProps> = ({
  balanceSummary,
  summary,
}) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const totalIncome = summary ? parseFloat(summary.total_income) || 0 : 0;
  const totalExpenses = summary ? parseFloat(summary.total_expenses) || 0 : 0;
  const currentBalance = summary ? parseFloat(summary.current_balance) || 0 : 0;
  const netSavings = summary ? parseFloat(summary.net_cash_flow) || 0 : 0;

  const savingsRate = totalIncome > 0 ? Math.max(0, (netSavings / totalIncome) * 100) : 0;

  const getHealthStatus = () => {
    if (savingsRate >= 30) return { label: 'Optimal Health', variant: 'success' as const, desc: 'High savings margin maintained.' };
    if (savingsRate >= 15) return { label: 'Healthy Progress', variant: 'info' as const, desc: 'Steady financial savings accumulation.' };
    if (savingsRate > 0) return { label: 'Low Savings Rate', variant: 'warning' as const, desc: 'Consider reducing discretionary expenses.' };
    return { label: 'Deficit Alert', variant: 'danger' as const, desc: 'Expenses exceed income for this period.' };
  };

  const health = getHealthStatus();

  return (
    <Card title="Financial Health & Savings" subtitle="Account liquid state & activity ratio">
      <div className="space-y-4">
        {/* Status Badge Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{health.label}</p>
              <p className="text-[11px] text-slate-400">{health.desc}</p>
            </div>
          </div>
          <Badge variant={health.variant} size="sm">
            {savingsRate.toFixed(0)}% Rate
          </Badge>
        </div>

        {/* Savings Gauge Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Savings Progress Rate</span>
            <span className="text-emerald-400 font-semibold">{savingsRate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Activity Breakdown metrics */}
        {balanceSummary && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="text-[10px] text-slate-400 block">Total Tx</span>
              <span className="text-sm font-bold text-slate-200 font-outfit">
                {balanceSummary.transaction_count}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="text-[10px] text-emerald-400 block">Inflows</span>
              <span className="text-sm font-bold text-emerald-400 font-outfit">
                {balanceSummary.income_transaction_count}
              </span>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
              <span className="text-[10px] text-rose-400 block">Outflows</span>
              <span className="text-sm font-bold text-rose-400 font-outfit">
                {balanceSummary.expense_transaction_count}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BalanceSavingsOverview;
