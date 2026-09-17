import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import BudgetProgress from './BudgetProgress';
import { Budget } from '../../types/budget';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Calendar, Edit2, Trash2, Tag, Globe, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export interface BudgetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
  currency?: string;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetDetailsModal: React.FC<BudgetDetailsModalProps> = ({
  isOpen,
  onClose,
  budget,
  currency = 'USD',
  onEdit,
  onDelete,
}) => {
  if (!budget) return null;

  const isOverall = budget.is_overall || budget.category === null || budget.category === undefined;
  const spent = budget.spent_amount !== undefined ? budget.spent_amount : 0;
  const limit = budget.amount;
  const remaining = budget.remaining_amount;
  const percentage = budget.percentage_used;
  const isExceeded = budget.is_exceeded;
  const isNearLimit = !isExceeded && percentage !== undefined && percentage >= 80;

  const periodLabelMap: Record<string, string> = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    CUSTOM: 'Custom Range',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Budget Details"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Header Title & Category */}
        <div className="space-y-2 pb-4 border-b border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{budget.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {isOverall ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium text-xs">
                    <Globe className="w-3.5 h-3.5" />
                    Overall Budget
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium text-xs">
                    <Tag className="w-3.5 h-3.5" />
                    {budget.category_name || 'Category Specific'}
                  </span>
                )}

                <Badge variant="secondary" size="sm">
                  {periodLabelMap[budget.period] || budget.period}
                </Badge>
              </div>
            </div>

            <Badge
              variant={isExceeded ? 'danger' : isNearLimit ? 'warning' : 'success'}
              size="md"
            >
              {isExceeded ? 'Over Budget' : isNearLimit ? 'Near Limit' : 'On Track'}
            </Badge>
          </div>
        </div>

        {/* Date Range */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Date Window:</span>
          </div>
          <span className="font-medium text-slate-100">
            {formatDate(budget.start_date)} — {formatDate(budget.end_date)}
          </span>
        </div>

        {/* Progress Bar & Stat Breakdown */}
        <div className="space-y-3 p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Spending Utilization
          </h4>
          <BudgetProgress
            spent={spent}
            limit={limit}
            remaining={remaining}
            percentage={percentage}
            isExceeded={isExceeded}
            currency={currency}
            showDetails={true}
          />
        </div>

        {/* Status Callout Banner */}
        {isExceeded ? (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-xs text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Budget Limit Exceeded</p>
              <p className="mt-0.5 text-rose-400/90">
                Total expense transactions within this period have passed the assigned limit by{' '}
                <strong className="font-mono">{formatCurrency(Math.abs(Number(remaining || 0)), currency)}</strong>.
              </p>
            </div>
          </div>
        ) : isNearLimit ? (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-xs text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">High Utilization Warning</p>
              <p className="mt-0.5 text-amber-400/90">
                You have consumed over 80% of this budget limit. Remaining balance is{' '}
                <strong className="font-mono">{formatCurrency(Number(remaining || 0), currency)}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-200">Healthy Spending</p>
              <p className="mt-0.5 text-emerald-400/90">
                Spending is safely within bounds. You have{' '}
                <strong className="font-mono">{formatCurrency(Number(remaining || 0), currency)}</strong> remaining.
              </p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Created {formatDate(budget.created_at)}
          </span>
          {budget.updated_at && (
            <span>Updated {formatDate(budget.updated_at)}</span>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onEdit(budget);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onDelete(budget);
              }}
            >
              Delete
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BudgetDetailsModal;
