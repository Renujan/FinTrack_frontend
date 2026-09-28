import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, TrendingUp, Sparkles } from 'lucide-react';
import { DashboardFinancialSummary, IncomeExpenseOverview } from '../../types/dashboard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export interface FinancialSummaryCardsProps {
  summary?: DashboardFinancialSummary;
  overview?: IncomeExpenseOverview;
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  summary,
  overview,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const balance = summary ? parseFloat(summary.current_balance) || 0 : 0;
  const income = summary ? parseFloat(summary.total_income) || 0 : 0;
  const expenses = summary ? parseFloat(summary.total_expenses) || 0 : 0;
  const netCashFlow = summary ? parseFloat(summary.net_cash_flow) || 0 : 0;

  const incomeChange = overview ? parseFloat(overview.income_percentage_change) || 0 : 0;
  const expenseChange = overview ? parseFloat(overview.expense_percentage_change) || 0 : 0;

  const savingsRate = income > 0 ? Math.max(0, Math.min(100, (netCashFlow / income) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Current Balance Card */}
      <Card
        onClick={() => navigate('/transactions')}
        className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 cursor-pointer hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Current Balance</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-100 font-outfit mt-2 tracking-tight">
          {formatCurrency(balance, currency)}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs">
          {balance >= 0 ? (
            <Badge variant="success" size="sm">
              <TrendingUp className="w-3 h-3 mr-1 inline" /> Positive Balance
            </Badge>
          ) : (
            <Badge variant="danger" size="sm">
              Overdrawn
            </Badge>
          )}
          <span className="text-[11px] text-slate-400 group-hover:text-emerald-300 transition-colors">
            View Ledger →
          </span>
        </div>
      </Card>

      {/* Total Income Card */}
      <Card
        onClick={() => navigate('/transactions')}
        className="relative overflow-hidden cursor-pointer hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Total Income</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-100 font-outfit mt-2 tracking-tight">
          {formatCurrency(income, currency)}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs">
          {incomeChange >= 0 ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {formatPercentage(incomeChange)} vs prev
            </span>
          ) : (
            <span className="text-rose-400 font-semibold flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {formatPercentage(incomeChange)} vs prev
            </span>
          )}
          <span className="text-[11px] text-slate-400 group-hover:text-sky-300 transition-colors">
            Details →
          </span>
        </div>
      </Card>

      {/* Total Expenses Card */}
      <Card
        onClick={() => navigate('/transactions')}
        className="relative overflow-hidden cursor-pointer hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Total Expenses</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-100 font-outfit mt-2 tracking-tight">
          {formatCurrency(expenses, currency)}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs">
          {expenseChange <= 0 ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {formatPercentage(expenseChange)} vs prev
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {formatPercentage(expenseChange)} vs prev
            </span>
          )}
          <span className="text-[11px] text-slate-400 group-hover:text-rose-300 transition-colors">
            Breakdown →
          </span>
        </div>
      </Card>

      {/* Net Savings Card */}
      <Card
        onClick={() => navigate('/analytics')}
        className="relative overflow-hidden cursor-pointer hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Net Savings & Rate</span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-bold font-outfit mt-2 tracking-tight ${netCashFlow >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
          {formatCurrency(netCashFlow, currency)}
        </p>

        {/* Savings Rate Mini Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-400" /> Savings Rate
            </span>
            <span className="font-semibold text-slate-200 text-[11px]">{savingsRate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialSummaryCards;
