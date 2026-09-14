import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import EmptyState from '../common/EmptyState';
import { Category, CategoryStats } from '../../types/category';
import { formatDate } from '../../utils/formatters';
import { Eye, Edit3, Trash2, Tag, Layers } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  statsMap: Record<number, CategoryStats>;
  isLoading: boolean;
  viewMode: 'grid' | 'table';
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddCategory: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  statsMap,
  isLoading,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onAddCategory,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse h-36 bg-slate-900/60" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Tag className="w-8 h-8 text-slate-400" />}
          title="No Categories Found"
          description="Create categories to organize your income and expenses, or try clearing search filters."
          actionLabel="+ Add Category"
          onAction={onAddCategory}
        />
      </Card>
    );
  }

  if (viewMode === 'table') {
    return (
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Transactions</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((category) => {
                const stat = statsMap[category.id];
                const txCount = stat ? stat.transaction_count : 0;

                return (
                  <tr key={category.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span>{category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={txCount > 0 ? 'emerald' : 'secondary'} size="sm">
                        {txCount} {txCount === 1 ? 'transaction' : 'transactions'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(category)}
                          aria-label={`View ${category.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(category)}
                          aria-label={`Edit ${category.name}`}
                        >
                          <Edit3 className="w-4 h-4 text-indigo-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(category)}
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  // Grid Card Layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const stat = statsMap[category.id];
        const txCount = stat ? stat.transaction_count : 0;

        return (
          <Card
            key={category.id}
            className="flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{category.name}</h3>
                    <p className="text-xs text-slate-400">Created {formatDate(category.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Badge variant={txCount > 0 ? 'emerald' : 'secondary'} size="sm">
                  <Layers className="w-3 h-3 mr-1 inline" />
                  {txCount} {txCount === 1 ? 'transaction' : 'transactions'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onView(category)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                aria-label={`Delete category ${category.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CategoryList;
