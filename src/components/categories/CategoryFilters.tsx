import React from 'react';
import Input from '../ui/Input';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { CategoryFilters as ICategoryFilters } from '../../types/category';

interface CategoryFiltersProps {
  filters: ICategoryFilters;
  onFilterChange: (newFilters: Partial<ICategoryFilters>) => void;
  onClearFilters: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  viewMode,
  onViewModeChange,
}) => {
  const hasActiveFilters = Boolean(filters.search || (filters.ordering && filters.ordering !== 'name'));

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <Input
          placeholder="Search categories by name..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          rightIcon={
            filters.search ? (
              <button
                type="button"
                onClick={() => onFilterChange({ search: '' })}
                className="hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Sorting Select & View Toggle */}
      <div className="flex items-center gap-3">
        <div className="w-44">
          <select
            value={filters.ordering || 'name'}
            onChange={(e) => onFilterChange({ ordering: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          >
            <option value="name">Name (A → Z)</option>
            <option value="-name">Name (Z → A)</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
          </select>
        </div>

        {/* Layout View Toggle */}
        <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
            className={`p-2 rounded-lg text-xs font-medium transition ${
              viewMode === 'grid'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Table View"
            className={`p-2 rounded-lg text-xs font-medium transition ${
              viewMode === 'table'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 transition"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilters;
