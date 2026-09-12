import React from 'react';
import Card from '../ui/Card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart2 } from 'lucide-react';
import { IncomeExpenseOverview as IncomeExpenseType, CashFlowSummaryItem } from '../../types/dashboard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';

export interface IncomeExpenseOverviewProps {
  overview?: IncomeExpenseType;
  cashFlow?: CashFlowSummaryItem[];
}

export const IncomeExpenseOverview: React.FC<IncomeExpenseOverviewProps> = ({
  overview,
  cashFlow,
}) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const currentIncome = overview ? parseFloat(overview.current_period.income) || 0 : 0;
  const currentExpenses = overview ? parseFloat(overview.current_period.expenses) || 0 : 0;

  const previousIncome = overview ? parseFloat(overview.previous_period.income) || 0 : 0;
  const previousExpenses = overview ? parseFloat(overview.previous_period.expenses) || 0 : 0;

  const maxVal = Math.max(currentIncome, currentExpenses, previousIncome, previousExpenses, 1);

  const currentIncomeHeight = Math.round((currentIncome / maxVal) * 100);
  const currentExpenseHeight = Math.round((currentExpenses / maxVal) * 100);
  const prevIncomeHeight = Math.round((previousIncome / maxVal) * 100);
  const prevExpenseHeight = Math.round((previousExpenses / maxVal) * 100);

  const netCurrent = currentIncome - currentExpenses;

  return (
    <Card
      title="Income vs Expenses Overview"
      subtitle="Period financial flow breakdown"
      className="h-full flex flex-col justify-between"
    >
      {/* Top metrics header */}
      <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Income Flow</span>
          </div>
          <p className="text-lg font-bold text-slate-100 font-outfit">
            {formatCurrency(currentIncome, currency)}
          </p>
          <p className="text-[11px] text-emerald-400 mt-0.5">
            {formatPercentage(overview?.income_percentage_change)} vs last period
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Expense Flow</span>
          </div>
          <p className="text-lg font-bold text-slate-100 font-outfit">
            {formatCurrency(currentExpenses, currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {formatPercentage(overview?.expense_percentage_change)} vs last period
          </p>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="my-2 space-y-4">
        <div className="space-y-3">
          {/* Current Period */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Current Period</span>
              <span className="text-slate-400 font-mono text-[11px]">
                Net: <span className={netCurrent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatCurrency(netCurrent, currency)}</span>
              </span>
            </div>
            <div className="space-y-1.5">
              {/* Income bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-14 shrink-0">Income</span>
                <div className="flex-1 h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${Math.max(currentIncomeHeight, 4)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-300 font-medium w-16 text-right shrink-0">
                  {formatCurrency(currentIncome, currency)}
                </span>
              </div>
              {/* Expense bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-14 shrink-0">Expenses</span>
                <div className="flex-1 h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.max(currentExpenseHeight, 4)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-300 font-medium w-16 text-right shrink-0">
                  {formatCurrency(currentExpenses, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Previous Period */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Previous Period</span>
            </div>
            <div className="space-y-1.5 opacity-80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-14 shrink-0">Income</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500/60 transition-all duration-500"
                    style={{ width: `${Math.max(prevIncomeHeight, 4)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 w-16 text-right shrink-0">
                  {formatCurrency(previousIncome, currency)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-14 shrink-0">Expenses</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500/60 transition-all duration-500"
                    style={{ width: `${Math.max(prevExpenseHeight, 4)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 w-16 text-right shrink-0">
                  {formatCurrency(previousExpenses, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cash flow breakdown list if present */}
      {cashFlow && cashFlow.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">Monthly Cash Flow Trend</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cashFlow.slice(0, 3).map((cf, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                <p className="text-[10px] text-slate-400">{cf.period}</p>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  Net: {formatCurrency(cf.net_cash_flow, currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default IncomeExpenseOverview;
