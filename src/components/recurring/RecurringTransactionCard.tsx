import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import RecurringTransactionStatusBadge from './RecurringTransactionStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RecurringTransaction } from '../../types/recurring';
import {
  Eye,
  Edit2,
  Trash2,
  Play,
  Pause,
  Zap,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from 'lucide-react';

interface RecurringTransactionCardProps {
  transaction: RecurringTransaction;
  currency?: string;
  onViewDetails: (item: RecurringTransaction) => void;
  onEdit: (item: RecurringTransaction) => void;
  onToggleStatus: (item: RecurringTransaction) => void;
  onExecute: (item: RecurringTransaction) => void;
  onDelete: (item: RecurringTransaction) => void;
  isActionLoading?: boolean;
}

export const RecurringTransactionCard: React.FC<RecurringTransactionCardProps> = ({
  transaction,
  currency = 'USD',
  onViewDetails,
  onEdit,
  onToggleStatus,
  onExecute,
  onDelete,
  isActionLoading = false,
}) => {
  const isIncome = transaction.transaction_type === 'INCOME';
  const name = transaction.name || transaction.title || 'Untitled Recurring Rule';

  return (
    <Card className="p-4 sm:p-5 bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80 transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Icon, Title, Category, Frequency */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Income vs Expense Indicator Icon */}
          <div
            className={`p-3 rounded-2xl shrink-0 mt-0.5 border ${
              isIncome
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                {name}
              </h3>

              {/* Category Pill */}
              {transaction.category_name && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {transaction.category_name}
                </span>
              )}
            </div>

            {/* Description snippet if exists */}
            {transaction.description && (
              <p className="text-xs text-slate-400 line-clamp-1">{transaction.description}</p>
            )}

            {/* Badges row: Active/Paused, Frequency, Due Date */}
            <div className="pt-1">
              <RecurringTransactionStatusBadge
                isActive={transaction.is_active}
                frequency={transaction.frequency}
                interval={transaction.interval}
                nextRunDate={transaction.next_run_date}
              />
            </div>
          </div>
        </div>

        {/* Center/Right Section: Amount & Start/End Dates */}
        <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 shrink-0">
          <div className="text-right">
            <span
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                isIncome ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, currency)}
            </span>
            <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Start: {formatDate(transaction.start_date)}</span>
              {transaction.end_date && (
                <span>• End: {formatDate(transaction.end_date)}</span>
              )}
            </div>
          </div>

          {/* Execution History Info */}
          {transaction.last_run_date && (
            <p className="text-[11px] text-slate-500 mt-1">
              Last executed: {formatDate(transaction.last_run_date)}
            </p>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 justify-end shrink-0">
          {/* Details Modal */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(transaction)}
            title="View Details"
            className="text-slate-400 hover:text-white"
          >
            <Eye className="w-4 h-4" />
            <span className="sr-only">View</span>
          </Button>

          {/* Edit Modal */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
            title="Edit Schedule"
            className="text-slate-400 hover:text-indigo-400"
          >
            <Edit2 className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </Button>

          {/* Pause / Resume Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(transaction)}
            disabled={isActionLoading}
            title={transaction.is_active ? 'Pause Schedule' : 'Resume Schedule'}
            className={
              transaction.is_active
                ? 'text-amber-400 hover:bg-amber-500/10'
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }
          >
            {transaction.is_active ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-emerald-400" />
            )}
            <span className="sr-only">{transaction.is_active ? 'Pause' : 'Resume'}</span>
          </Button>

          {/* Execute Now Manual Action */}
          {transaction.is_active && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExecute(transaction)}
              disabled={isActionLoading}
              title="Execute Now Manually"
              className="text-xs py-1 px-2.5 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10"
            >
              <Zap className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              Run
            </Button>
          )}

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction)}
            title="Delete Schedule"
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecurringTransactionCard;
