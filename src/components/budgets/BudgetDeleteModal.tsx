import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Budget } from '../../types/budget';
import { formatCurrency } from '../../utils/formatters';
import parseApiError from '../../utils/errorHandler';
import { AlertTriangle, Trash2 } from 'lucide-react';

export interface BudgetDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (budget: Budget) => Promise<void>;
  budget: Budget | null;
  currency?: string;
}

export const BudgetDeleteModal: React.FC<BudgetDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  budget,
  currency = 'USD',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!budget) return null;

  const handleDelete = async () => {
    setError(null);
    try {
      setIsLoading(true);
      await onConfirm(budget);
      onClose();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to delete budget.');
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Budget"
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="font-semibold text-slate-100 text-sm">Confirm Deletion</h4>
          </div>
          <p className="text-xs text-slate-300">
            Are you sure you want to delete <strong className="text-slate-100">{budget.name}</strong> ({formatCurrency(budget.amount, currency)})?
          </p>
          <p className="text-[11px] text-slate-400">
            Deleting this budget will remove its spending limit tracking. Your actual transaction records and category settings will remain completely intact.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={isLoading}
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleDelete}
          >
            Delete Budget
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BudgetDeleteModal;
