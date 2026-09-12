import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { DashboardFinancialSummary, IncomeExpenseOverview } from '../../types/dashboard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';

export interface FinancialSummaryCardsProps {
  summary?: DashboardFinancialSummary;
  overview?: IncomeExpenseOverview;
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  summary,
  overview,
}) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const balance = summary ? parseFloat(summary.current_balance) || 0 : 0;
  const income = summary ? parseFloat(summary.total_income) || 0 : 0;
  const expenses = summary ? parseFloat(summary.total_expenses) || 0 : 0;
  const netCashFlow = summary ? parseFloat(summary.net_cash_flow) || 0 : 0;

  const incomeChange = overview ? parseFloat(overview.income_percentage_change) || 0 : 0;
  const expenseChange = overview ? parseFloat(overview.expense_percentage_change) || 0 : 0;

  const savingsRate = income > 0 ? (netCashFlow / income) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Current Balance Card */}
      <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Current Balance</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">
          {formatCurrency(balance, currency)}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          {balance >= 0 ? (
            <Badge variant="success" size="sm">
              Positive Balance
            </Badge>
          ) : (
            <Badge variant="danger" size="sm">
              Overdrawn
            </Badge>
          )}
          <span className="text-[11px] text-slate-400">Total liquid funds</span>
        </div>
      </Card>

      {/* Total Income Card */}
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Total Income</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">
          {formatCurrency(income, currency)}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          {incomeChange >= 0 ? (
            <span className="text-emerald-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {formatPercentage(incomeChange)} vs prev
            </span>
          ) : (
            <span className="text-rose-400 font-medium flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {formatPercentage(incomeChange)} vs prev
            </span>
          )}
        </div>
      </Card>

      {/* Total Expenses Card */}
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Total Expenses</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">
          {formatCurrency(expenses, currency)}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          {expenseChange <= 0 ? (
            <span className="text-emerald-400 font-medium flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {formatPercentage(expenseChange)} vs prev
            </span>
          ) : (
            <span className="text-amber-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {formatPercentage(expenseChange)} vs prev
            </span>
          )}
        </div>
      </Card>

      {/* Net Savings Card */}
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium tracking-wide">Net Savings</span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-2xl font-bold font-outfit mt-2 ${netCashFlow >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
          {formatCurrency(netCashFlow, currency)}
        </p>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>Savings Rate:</span>
          <span className="font-semibold text-slate-200">{savingsRate.toFixed(1)}%</span>
        </div>
      </Card>
    </div>
  );
};

export default FinancialSummaryCards;
