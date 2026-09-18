import React from 'react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { RecurringTransaction } from '../../types/recurring';
import { Play, Pause, Calendar, TrendingDown, TrendingUp } from 'lucide-react';

interface RecurringTransactionSummaryProps {
  transactions: RecurringTransaction[];
  totalCount: number;
  currency?: string;
}

export const RecurringTransactionSummary: React.FC<RecurringTransactionSummaryProps> = ({
  transactions,
  totalCount,
  currency = 'USD',
}) => {
  const activeList = transactions.filter((t) => t.is_active);
  const pausedList = transactions.filter((t) => !t.is_active);

  // Compute total monthly projected expense/income from active items
  let monthlyExpense = 0;
  let monthlyIncome = 0;

  activeList.forEach((item) => {
    const amt = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
    const num = isNaN(amt) ? 0 : amt;
    const interval = item.interval || 1;

    // Approximate monthly multiplier based on frequency & interval
    let monthlyMultiplier = 1;
    if (item.frequency === 'DAILY') {
      monthlyMultiplier = 30 / interval;
    } else if (item.frequency === 'WEEKLY') {
      monthlyMultiplier = 4.33 / interval;
    } else if (item.frequency === 'MONTHLY') {
      monthlyMultiplier = 1 / interval;
    } else if (item.frequency === 'YEARLY') {
      monthlyMultiplier = (1 / 12) / interval;
    }

    if (item.transaction_type === 'EXPENSE') {
      monthlyExpense += num * monthlyMultiplier;
    } else {
      monthlyIncome += num * monthlyMultiplier;
    }
  });

  // Calculate upcoming due in next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  const dueSoonCount = activeList.filter((item) => {
    if (!item.next_run_date) return false;
    const d = new Date(item.next_run_date);
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= sevenDaysLater;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Schedules Card */}
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Schedules</p>
            <h4 className="text-2xl font-bold text-white mt-1">{activeList.length}</h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Play className="w-5 h-5 fill-emerald-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Out of <span className="font-semibold text-slate-200">{totalCount}</span> total recurring rules
        </p>
      </Card>

      {/* Paused Schedules Card */}
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Paused Schedules</p>
            <h4 className="text-2xl font-bold text-amber-300 mt-1">{pausedList.length}</h4>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Pause className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">Temporarily stopped executions</p>
      </Card>

      {/* Monthly Recurring Expense Card */}
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Est. Monthly Expense</p>
            <h4 className="text-2xl font-bold text-rose-400 mt-1">
              {formatCurrency(monthlyExpense, currency)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        {monthlyIncome > 0 ? (
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            + {formatCurrency(monthlyIncome, currency)} monthly income
          </p>
        ) : (
          <p className="text-xs text-slate-400 mt-2">Projected regular commitments</p>
        )}
      </Card>

      {/* Due Soon Card */}
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Due Next 7 Days</p>
            <h4 className="text-2xl font-bold text-sky-400 mt-1">{dueSoonCount}</h4>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">Upcoming automatic processing</p>
      </Card>
    </div>
  );
};

export default RecurringTransactionSummary;
