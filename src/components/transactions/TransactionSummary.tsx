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
      <Card className="p-4 border-l-4 border-l-emerald-500 bg-slate-900/80 backdrop-blur-md hover:shadow-glow-emerald">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Income</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-heading">
              {formatCurrency(incomeTotal, currency)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-l-4 border-l-rose-500 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-2xl font-extrabold text-rose-400 mt-1 font-heading">
              {formatCurrency(expenseTotal, currency)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card
        className={`p-4 border-l-4 ${
          netTotal >= 0 ? 'border-l-teal-500' : 'border-l-amber-500'
        } bg-slate-900/80 backdrop-blur-md`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Balance</p>
            <h3
              className={`text-2xl font-extrabold mt-1 font-heading ${
                netTotal >= 0 ? 'text-teal-400' : 'text-amber-400'
              }`}
            >
              {formatCurrency(netTotal, currency)}
            </h3>
          </div>
          <div
            className={`p-3 rounded-xl border ${
              netTotal >= 0 ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-l-4 border-l-cyan-500 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transactions</p>
            <h3 className="text-2xl font-extrabold text-cyan-400 mt-1 font-heading">{totalCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransactionSummary;
