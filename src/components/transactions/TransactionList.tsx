import React from 'react';
import { Eye, Edit3, Trash2, ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types/transaction';

export interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  currency?: string;
  onViewDetails: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onAddTransaction: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  currency = 'USD',
  onViewDetails,
  onEdit,
  onDelete,
  onAddTransaction,
}) => {
  if (isLoading) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-slate-400">Loading transactions...</p>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-4">
        <EmptyState
          icon={<ArrowLeftRight className="w-8 h-8" />}
          title="No transactions found"
          description="We couldn't find any financial transactions matching your current criteria or filters."
          actionLabel="Add Transaction"
          onAction={onAddTransaction}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th scope="col" className="py-3.5 px-4">
                Date
              </th>
              <th scope="col" className="py-3.5 px-4">
                Description
              </th>
              <th scope="col" className="py-3.5 px-4">
                Category
              </th>
              <th scope="col" className="py-3.5 px-4">
                Type
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Amount
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {transactions.map((tx) => {
              const isIncome = tx.transaction_type === 'INCOME';

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails(tx)}
                >
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-medium">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-100 max-w-xs truncate">
                    {tx.description || 'Unspecified Transaction'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tx.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={isIncome ? 'success' : 'danger'} size="sm">
                      <span className="flex items-center gap-1">
                        {isIncome ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {tx.transaction_type}
                      </span>
                    </Badge>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                  </td>
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(tx)}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(tx)}
                        title="Edit Transaction"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        title="Delete Transaction"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const isIncome = tx.transaction_type === 'INCOME';

          return (
            <Card
              key={tx.id}
              className="p-4 space-y-3 border-l-4 hover:border-emerald-500 transition cursor-pointer"
              onClick={() => onViewDetails(tx)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{tx.description || 'Unspecified'}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.date)}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-base font-bold ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {tx.category_name || 'Uncategorized'}
                  </span>
                  <Badge variant={isIncome ? 'success' : 'danger'} size="sm">
                    {tx.transaction_type}
                  </Badge>
                </div>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onViewDetails(tx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(tx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
