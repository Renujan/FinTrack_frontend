import React from 'react';
import { Search, X, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Category, TransactionFilters as FilterState, TransactionType } from '../../types/transaction';

export interface TransactionFiltersProps {
  filters: FilterState;
  categories: Category[];
  onFilterChange: (updatedFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  categories,
  onFilterChange,
  onResetFilters,
  isLoading = false,
}) => {
  const hasActiveFilters = Boolean(
    filters.search ||
      filters.type ||
      filters.category ||
      filters.start_date ||
      filters.end_date ||
      (filters.ordering && filters.ordering !== '-date')
  );

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Top Row: Search & Quick Type Filter */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:flex-1 relative">
            <Input
              type="text"
              placeholder="Search by description or category name..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                filters.search ? (
                  <button
                    type="button"
                    onClick={() => onFilterChange({ search: '', page: 1 })}
                    className="p-1 hover:text-slate-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : undefined
              }
              disabled={isLoading}
            />
          </div>

          {/* Type Segment Control */}
          <div className="w-full md:w-auto flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onFilterChange({ type: undefined, page: 1 })}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                !filters.type
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'INCOME' as TransactionType, page: 1 })}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                filters.type === 'INCOME'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'EXPENSE' as TransactionType, page: 1 })}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                filters.type === 'EXPENSE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Bottom Row: Detailed Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-400">Category</label>
            <div className="relative">
              <select
                value={filters.category || ''}
                onChange={(e) => onFilterChange({ category: e.target.value || undefined, page: 1 })}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date From
            </label>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => onFilterChange({ start_date: e.target.value || undefined, page: 1 })}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date To
            </label>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => onFilterChange({ end_date: e.target.value || undefined, page: 1 })}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* Ordering / Sort */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort By
            </label>
            <select
              value={filters.ordering || '-date'}
              onChange={(e) => onFilterChange({ ordering: e.target.value, page: 1 })}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="-date">Date: Newest First</option>
              <option value="date">Date: Oldest First</option>
              <option value="-amount">Amount: High to Low</option>
              <option value="amount">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              disabled={isLoading}
              leftIcon={<X className="w-3.5 h-3.5" />}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
