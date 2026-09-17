import React from 'react';
import BudgetCard from './BudgetCard';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';
import { Budget } from '../../types/budget';
import { PieChart, Plus, AlertCircle, RefreshCw } from 'lucide-react';

export interface BudgetListProps {
  budgets: Budget[];
  currency?: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onCreateNew?: () => void;
  onViewDetails: (budget: Budget) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  currency = 'USD',
  isLoading = false,
  error = null,
  onRefresh,
  onCreateNew,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-800 rounded" />
              <div className="h-4 w-16 bg-slate-800 rounded-full" />
            </div>
            <div className="h-7 w-48 bg-slate-800 rounded" />
            <div className="h-3 w-full bg-slate-800 rounded" />
            <div className="h-3 w-2/3 bg-slate-800 rounded" />
            <div className="h-10 w-full bg-slate-800/80 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-4">
        <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-100">Failed to load budgets</h3>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRefresh}
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
        <EmptyState
          icon={<PieChart className="w-12 h-12 text-slate-500" />}
          title="No budgets found"
          description="Create your first budget to start tracking your spending against limits and avoid overspending."
          action={
            onCreateNew ? (
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={onCreateNew}
              >
                Create First Budget
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          currency={currency}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BudgetList;
