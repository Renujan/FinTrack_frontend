import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Percent, ArrowLeftRight } from 'lucide-react';
import { AnalyticsSummary } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary | null;
  currency?: string;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  summary,
  currency = 'USD',
}) => {
  if (!summary) return null;

  const totalIncome = summary.total_income || 0;
  const totalExpenses = summary.total_expenses || 0;
  const netBalance = summary.net_balance !== undefined ? summary.net_balance : totalIncome - totalExpenses;
  const savingsRate = summary.savings_rate || 0;
  const transactionCount = summary.transaction_count || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Income */}
      <Card className="!p-4 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Income</p>
            <p className="text-xl font-extrabold text-emerald-400 mt-1 font-heading">
              {formatCurrency(totalIncome, currency)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </Card>

      {/* Total Expenses */}
      <Card className="!p-4 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</p>
            <p className="text-xl font-extrabold text-rose-400 mt-1 font-heading">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
      </Card>

      {/* Net Balance */}
      <Card className="!p-4 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Balance</p>
            <p className={`text-xl font-extrabold mt-1 font-heading ${netBalance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
              {formatCurrency(netBalance, currency)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </Card>

      {/* Savings Rate */}
      <Card className="!p-4 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Savings Rate</p>
            <p className="text-xl font-extrabold text-cyan-400 mt-1 font-heading">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
      </Card>

      {/* Transaction Count */}
      <Card className="!p-4 bg-slate-900/80 border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Transactions</p>
            <p className="text-xl font-extrabold text-white mt-1 font-heading">
              {transactionCount}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsSummaryCards;
