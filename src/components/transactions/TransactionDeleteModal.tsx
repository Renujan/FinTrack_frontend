import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Transaction } from '../../types/transaction';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { AlertTriangle } from 'lucide-react';

export interface TransactionDeleteModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  currency?: string;
}

export const TransactionDeleteModal: React.FC<TransactionDeleteModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
  isLoading = false,
  error,
  currency = 'USD',
}) => {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Transaction" maxWidth="md">
      <div className="space-y-4">
        {error && <ErrorMessage message={error} />}

        <div className="flex items-start gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Confirm Permanent Deletion</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Are you sure you want to delete this transaction record? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400 text-xs">Description:</span>
            <span className="font-medium text-slate-200">{transaction.description || 'Unspecified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-xs">Amount:</span>
            <span className="font-bold text-slate-100">{formatCurrency(transaction.amount, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-xs">Date:</span>
            <span className="text-slate-300">{formatDate(transaction.date)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading}>
            Delete Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDeleteModal;
