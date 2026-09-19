import React from 'react';
import Card from '../ui/Card';
import { IncomeExpenseAnalytics } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';

interface IncomeExpenseChartProps {
  data: IncomeExpenseAnalytics | null;
  currency?: string;
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  data,
  currency = 'USD',
}) => {
  if (!data) return null;

  const income = data.income || 0;
  const expenses = data.expenses || 0;
  const maxVal = Math.max(income, expenses, 1);

  const incomeWidth = (income / maxVal) * 100;
  const expenseWidth = (expenses / maxVal) * 100;

  const net = data.net !== undefined ? data.net : income - expenses;

  return (
    <Card title="Income vs Expenses" subtitle="Comparative breakdown for current period">
      <div className="space-y-6 my-2">
        {/* Metric Summary Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <ArrowUpRight className="w-4 h-4" />
              Total Income
            </div>
            <p className="text-xl font-bold text-white">
              {formatCurrency(income, currency)}
            </p>
            {data.income_count !== undefined && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                {data.income_count} income entries
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mb-1">
              <ArrowDownRight className="w-4 h-4" />
              Total Expenses
            </div>
            <p className="text-xl font-bold text-white">
              {formatCurrency(expenses, currency)}
            </p>
            {data.expense_count !== undefined && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                {data.expense_count} expense entries
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
              <Scale className="w-4 h-4 text-teal-400" />
              Net Period Savings
            </div>
            <p className={`text-xl font-bold ${net >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
              {formatCurrency(net, currency)}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Savings Rate: <strong className="text-emerald-400">{(data.savings_rate || 0).toFixed(1)}%</strong>
            </span>
          </div>
        </div>

        {/* Visual Comparison Bars */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          {/* Income Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Income</span>
              <span className="font-bold text-emerald-400">{formatCurrency(income, currency)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(2, incomeWidth))}%` }}
              />
            </div>
          </div>

          {/* Expense Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Expenses</span>
              <span className="font-bold text-red-400">{formatCurrency(expenses, currency)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(2, expenseWidth))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IncomeExpenseChart;
