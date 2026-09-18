import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import RecurringTransactionStatusBadge, { formatFrequencyText } from './RecurringTransactionStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RecurringTransaction, RecurringTransactionExecution } from '../../types/recurring';
import recurringService from '../../services/recurringService';
import {
  Calendar,
  Clock,
  Tag,
  Edit2,
  Trash2,
  Play,
  Pause,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  CheckCircle2,
  AlertCircle,
  SkipForward,
} from 'lucide-react';

interface RecurringTransactionDetailsModalProps {
  isOpen: boolean;
  transaction: RecurringTransaction | null;
  onClose: () => void;
  onEdit: (item: RecurringTransaction) => void;
  onDelete: (item: RecurringTransaction) => void;
  onToggleStatus: (item: RecurringTransaction) => Promise<void>;
  onExecute: (item: RecurringTransaction) => Promise<void>;
  currency?: string;
}

export const RecurringTransactionDetailsModal: React.FC<RecurringTransactionDetailsModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onExecute,
  currency = 'USD',
}) => {
  const [history, setHistory] = useState<RecurringTransactionExecution[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const fetchHistory = useCallback(async (id: number) => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await recurringService.getRecurringHistory(id);
      setHistory(res.results || []);
    } catch {
      setHistoryError('Execution history unavailable.');
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && transaction?.id) {
      fetchHistory(transaction.id);
    } else {
      setHistory([]);
    }
  }, [isOpen, transaction, fetchHistory]);

  if (!transaction) return null;

  const isIncome = transaction.transaction_type === 'INCOME';
  const name = transaction.name || transaction.title || 'Recurring Rule Details';

  const handleToggle = async () => {
    setIsActionLoading(true);
    try {
      await onToggleStatus(transaction);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleManualExecute = async () => {
    setIsActionLoading(true);
    try {
      await onExecute(transaction);
      if (transaction.id) {
        fetchHistory(transaction.id);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recurring Transaction Details">
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl border ${
                isIncome
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {isIncome ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  {transaction.transaction_type}
                </span>
                {transaction.category_name && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {transaction.category_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div
              className={`text-2xl font-bold tracking-tight ${
                isIncome ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, currency)}
            </div>
            <div className="mt-1">
              <RecurringTransactionStatusBadge
                isActive={transaction.is_active}
                frequency={transaction.frequency}
                interval={transaction.interval}
                nextRunDate={transaction.next_run_date}
                showScheduleInfo={false}
              />
            </div>
          </div>
        </div>

        {/* Schedule & Rules Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Frequency
            </span>
            <span className="text-sm font-semibold text-slate-200 mt-1 block">
              {formatFrequencyText(transaction.frequency, transaction.interval)}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Next Execution
            </span>
            <span className="text-sm font-semibold text-indigo-300 mt-1 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {transaction.next_run_date ? formatDate(transaction.next_run_date) : 'N/A'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Last Executed
            </span>
            <span className="text-sm font-semibold text-slate-300 mt-1 block">
              {transaction.last_run_date ? formatDate(transaction.last_run_date) : 'Never'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Start Date
            </span>
            <span className="text-sm font-semibold text-slate-300 mt-1 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(transaction.start_date)}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              End Date
            </span>
            <span className="text-sm font-semibold text-slate-300 mt-1 block">
              {transaction.end_date ? formatDate(transaction.end_date) : 'Ongoing (No end)'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Created Date
            </span>
            <span className="text-sm font-semibold text-slate-400 mt-1 block">
              {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Description Section if present */}
        {transaction.description && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Description / Notes
            </span>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {transaction.description}
            </p>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <Button
              variant={transaction.is_active ? 'outline' : 'primary'}
              size="sm"
              onClick={handleToggle}
              isLoading={isActionLoading}
              leftIcon={
                transaction.is_active ? (
                  <Pause className="w-4 h-4 text-amber-400" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-emerald-400" />
                )
              }
            >
              {transaction.is_active ? 'Pause Schedule' : 'Resume Schedule'}
            </Button>

            {transaction.is_active && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualExecute}
                isLoading={isActionLoading}
                leftIcon={<Zap className="w-4 h-4 text-indigo-400" />}
                className="border-indigo-500/40 text-indigo-300"
              >
                Execute Now
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(transaction);
              }}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
              className="text-rose-400 hover:bg-rose-500/10"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Execution History Section */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-400" />
              Execution History Records
            </h4>
            <span className="text-[11px] text-slate-500">
              {history.length} record{history.length === 1 ? '' : 's'}
            </span>
          </div>

          {isHistoryLoading ? (
            <div className="p-4 text-center text-xs text-slate-500 animate-pulse">
              Loading execution log history...
            </div>
          ) : historyError ? (
            <p className="text-xs text-slate-500 p-2">{historyError}</p>
          ) : history.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/60 text-center text-xs text-slate-400">
              No executions logged yet for this schedule.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    {record.status === 'SUCCESS' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : record.status === 'FAILED' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <SkipForward className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-medium text-slate-200 block">
                        Status: {record.status}
                      </span>
                      {record.error_message && (
                        <span className="text-[11px] text-rose-400 block mt-0.5">
                          {record.error_message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-slate-400">
                    <span className="block text-[11px]">{formatDate(record.executed_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RecurringTransactionDetailsModal;
