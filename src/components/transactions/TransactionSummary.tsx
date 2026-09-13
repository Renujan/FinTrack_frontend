import React from 'react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, Wallet, ArrowLeftRight } from 'lucide-react';

export interface TransactionSummaryProps {
  incomeTotal: number;
  expenseTotal: number;
  netTotal: number;
  totalCount: number;
  currency?: string;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  incomeTotal,
  expenseTotal,
  netTotal,
  totalCount,
  currency = 'USD',
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 border-l-4 border-l-emerald-500 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Income</p>
            <h3 className="text-xl font-bold text-emerald-400 mt-1">
              {formatCurrency(incomeTotal, currency)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-l-4 border-l-rose-500 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-xl font-bold text-rose-400 mt-1">
              {formatCurrency(expenseTotal, currency)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card
        className={`p-4 border-l-4 ${
          netTotal >= 0 ? 'border-l-sky-500' : 'border-l-amber-500'
        } bg-slate-900/60`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Balance</p>
            <h3
              className={`text-xl font-bold mt-1 ${
                netTotal >= 0 ? 'text-sky-400' : 'text-amber-400'
              }`}
            >
              {formatCurrency(netTotal, currency)}
            </h3>
          </div>
          <div
            className={`p-2.5 rounded-xl ${
              netTotal >= 0 ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-l-4 border-l-indigo-500 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Transactions</p>
            <h3 className="text-xl font-bold text-indigo-400 mt-1">{totalCount}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransactionSummary;
