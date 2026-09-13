import React from 'react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types/transaction';
import { Edit3, Trash2, Calendar, Tag, FileText, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

export interface TransactionDetailsModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  currency?: string;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onEdit,
  onDelete,
  currency = 'USD',
}) => {
  if (!transaction) return null;

  const isIncome = transaction.transaction_type === 'INCOME';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" maxWidth="md">
      <div className="space-y-6">
        {/* Header Amount Box */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isIncome
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-rose-500/10 border-rose-500/30'
          }`}
        >
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {transaction.transaction_type}
            </span>
            <h2
              className={`text-2xl font-bold mt-0.5 ${
                isIncome ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, currency)}
            </h2>
          </div>

          <div
            className={`p-3 rounded-2xl ${
              isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isIncome ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Description</p>
              <p className="font-semibold text-slate-100 mt-0.5">
                {transaction.description || 'No description provided.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <Tag className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Category</p>
                <div className="mt-1">
                  <Badge variant="neutral" size="sm">
                    {transaction.category_name || 'Uncategorized'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Transaction Date</p>
                <p className="font-semibold text-slate-100 mt-0.5">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          </div>

          {transaction.created_at && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-800">
              <Clock className="w-3.5 h-3.5" />
              <span>Recorded on {formatDate(transaction.created_at)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(transaction);
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
