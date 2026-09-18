import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Category } from '../../types/category';
import { RecurringTransactionFilters as FilterState } from '../../types/recurring';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface RecurringTransactionFiltersProps {
  filters: FilterState;
  categories: Category[];
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export const RecurringTransactionFilters: React.FC<RecurringTransactionFiltersProps> = ({
  filters,
  categories,
  onFilterChange,
  onResetFilters,
  isLoading = false,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1">
          <Input
            placeholder="Search by title, description, or category..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            disabled={isLoading}
          />
        </div>

        {/* Action button reset */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            disabled={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Filter Select Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1 border-t border-slate-800/80">
        {/* Type Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Type
          </label>
          <select
            value={filters.transaction_type || filters.type || ''}
            onChange={(e) =>
              onFilterChange({
                transaction_type: e.target.value as 'INCOME' | 'EXPENSE' | '',
                type: e.target.value as 'INCOME' | 'EXPENSE' | '',
                page: 1,
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          >
            <option value="">All Types</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Frequency
          </label>
          <select
            value={filters.frequency || ''}
            onChange={(e) => onFilterChange({ frequency: e.target.value, page: 1 })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          >
            <option value="">All Frequencies</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.is_active !== undefined ? String(filters.is_active) : ''}
            onChange={(e) =>
              onFilterChange({
                is_active: e.target.value === '' ? '' : e.target.value === 'true',
                page: 1,
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Paused Only</option>
          </select>
        </div>

        {/* Ordering */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Order By
          </label>
          <select
            value={filters.ordering || 'next_run_date'}
            onChange={(e) => onFilterChange({ ordering: e.target.value, page: 1 })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          >
            <option value="next_run_date">Next Run Date (Earliest)</option>
            <option value="-next_run_date">Next Run Date (Latest)</option>
            <option value="-amount">Amount (High to Low)</option>
            <option value="amount">Amount (Low to High)</option>
            <option value="name">Name (A-Z)</option>
            <option value="-created_at">Recently Created</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RecurringTransactionFilters;
