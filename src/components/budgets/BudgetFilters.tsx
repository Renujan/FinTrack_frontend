import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { BudgetFiltersParams, BudgetPeriod } from '../../types/budget';
import { Category } from '../../types/category';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

export interface BudgetFiltersProps {
  filters: BudgetFiltersParams;
  categories: Category[];
  onChange: (newFilters: BudgetFiltersParams) => void;
  onReset: () => void;
}

export const BudgetFilters: React.FC<BudgetFiltersProps> = ({
  filters,
  categories,
  onChange,
  onReset,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'overall') {
      onChange({ ...filters, is_overall: true, category: undefined, page: 1 });
    } else if (val === '') {
      onChange({ ...filters, is_overall: undefined, category: undefined, page: 1 });
    } else {
      onChange({ ...filters, is_overall: undefined, category: val, page: 1 });
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as BudgetPeriod | '';
    onChange({ ...filters, period: val || undefined, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'exceeded') {
      onChange({ ...filters, is_exceeded: true, page: 1 });
    } else if (val === 'normal') {
      onChange({ ...filters, is_exceeded: false, page: 1 });
    } else {
      onChange({ ...filters, is_exceeded: undefined, page: 1 });
    }
  };

  const handleOrderingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, ordering: e.target.value || undefined, page: 1 });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.category !== undefined ||
    filters.period !== undefined ||
    filters.is_overall !== undefined ||
    filters.is_exceeded !== undefined ||
    Boolean(filters.ordering);

  return (
    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="lg:col-span-1">
          <Input
            placeholder="Search budgets..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category / Scope filter */}
        <div>
          <select
            value={
              filters.is_overall
                ? 'overall'
                : filters.category !== undefined
                ? String(filters.category)
                : ''
            }
            onChange={handleCategoryChange}
            aria-label="Filter by category"
            className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            <option value="">All Categories & Scopes</option>
            <option value="overall">Overall Budget Only</option>
            <optgroup label="Categories">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Period filter */}
        <div>
          <select
            value={filters.period || ''}
            onChange={handlePeriodChange}
            aria-label="Filter by period"
            className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            <option value="">All Periods</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="CUSTOM">Custom Range</option>
          </select>
        </div>

        {/* Status filter */}
        <div>
          <select
            value={
              filters.is_exceeded === true
                ? 'exceeded'
                : filters.is_exceeded === false
                ? 'normal'
                : ''
            }
            onChange={handleStatusChange}
            aria-label="Filter by status"
            className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            <option value="">All Statuses</option>
            <option value="exceeded">Over Budget Only</option>
            <option value="normal">Within Limit Only</option>
          </select>
        </div>

        {/* Sort Ordering */}
        <div>
          <select
            value={filters.ordering || '-start_date'}
            onChange={handleOrderingChange}
            aria-label="Sort budgets"
            className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            <option value="-start_date">Newest Start Date</option>
            <option value="start_date">Oldest Start Date</option>
            <option value="-amount">Highest Amount</option>
            <option value="amount">Lowest Amount</option>
            <option value="-percentage_used">Highest Usage %</option>
            <option value="percentage_used">Lowest Usage %</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filters applied</span>
          </div>

          <button
            onClick={onReset}
            className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetFilters;
