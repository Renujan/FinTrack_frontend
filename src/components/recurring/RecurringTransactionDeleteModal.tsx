import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { formatCurrency } from '../../utils/formatters';
import { RecurringTransaction } from '../../types/recurring';
import { AlertTriangle } from 'lucide-react';

interface RecurringTransactionDeleteModalProps {
  isOpen: boolean;
  transaction: RecurringTransaction | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  currency?: string;
}

export const RecurringTransactionDeleteModal: React.FC<RecurringTransactionDeleteModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
  isLoading = false,
  error,
  currency = 'USD',
}) => {
  if (!transaction) return null;

  const name = transaction.name || transaction.title || 'Recurring Schedule';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Recurring Transaction?">
      <div className="space-y-4">
        {/* Error Alert */}
        {error && <ErrorMessage message={error} />}

        {/* Warning Callout Box */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-rose-200">This action will remove the recurring schedule.</p>
            <p className="text-slate-300">
              Future automated transaction generation will be stopped. Historical transactions created by previous runs will not be affected.
            </p>
          </div>
        </div>

        {/* Item Details Card */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Target Schedule:</p>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-indigo-400 font-semibold">
            {formatCurrency(transaction.amount, currency)} ({transaction.frequency})
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RecurringTransactionDeleteModal;
