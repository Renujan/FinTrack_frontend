import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import BudgetProgress from './BudgetProgress';
import { Budget } from '../../types/budget';
import { formatDate } from '../../utils/formatters';
import { Calendar, Eye, Edit2, Trash2, Tag, Globe } from 'lucide-react';

export interface BudgetCardProps {
  budget: Budget;
  currency?: string;
  onViewDetails: (budget: Budget) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  currency = 'USD',
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const isOverall = budget.is_overall || budget.category === null || budget.category === undefined;
  const spent = budget.spent_amount !== undefined ? budget.spent_amount : 0;
  const limit = budget.amount;
  const remaining = budget.remaining_amount;
  const percentage = budget.percentage_used;
  const isExceeded = budget.is_exceeded;

  const periodLabelMap: Record<string, string> = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    CUSTOM: 'Custom',
  };

  const periodLabel = periodLabelMap[budget.period] || budget.period;

  return (
    <Card className="flex flex-col justify-between border-slate-800/80 bg-slate-900/90 hover:border-slate-700/80 transition-all duration-200 shadow-lg group">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
              {budget.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {isOverall ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium text-[11px]">
                  <Globe className="w-3 h-3" />
                  Overall Budget
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium text-[11px]">
                  <Tag className="w-3 h-3" />
                  {budget.category_name || 'Category'}
                </span>
              )}

              <Badge variant="secondary" size="sm">
                {periodLabel}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onViewDetails(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="View details"
              aria-label={`View details for ${budget.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
              title="Edit budget"
              aria-label={`Edit ${budget.name}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Delete budget"
              aria-label={`Delete ${budget.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dates Range */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
          </span>
        </div>

        {/* Usage Progress Bar */}
        <div className="pt-2">
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
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <button
          onClick={() => onViewDetails(budget)}
          className="text-slate-400 hover:text-emerald-400 font-medium transition flex items-center gap-1"
        >
          <span>View Detailed Breakdown</span>
          <span aria-hidden="true">→</span>
        </button>

        <span className="text-[11px] text-slate-500">
          Updated {formatDate(budget.updated_at || budget.created_at)}
        </span>
      </div>
    </Card>
  );
};

export default BudgetCard;
