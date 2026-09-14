import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Category, CategoryStats } from '../../types/category';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Tag, Calendar, Edit3, Trash2, Layers, DollarSign } from 'lucide-react';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  stats?: CategoryStats;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  isOpen,
  onClose,
  category,
  stats,
  onEdit,
  onDelete,
}) => {
  if (!category) return null;

  const txCount = stats ? stats.transaction_count : 0;
  const totalAmount = stats ? stats.total_amount : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Category Details"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">{category.name}</h3>
            <p className="text-xs text-slate-400">Category ID: #{category.id}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Total Transactions</span>
            </div>
            <p className="text-lg font-bold text-slate-100">
              <Badge variant={txCount > 0 ? 'emerald' : 'secondary'}>
                {txCount} {txCount === 1 ? 'transaction' : 'transactions'}
              </Badge>
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Activity Volume</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{formatCurrency(totalAmount)}</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Created At</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatDate(category.created_at)}</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Last Updated</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{formatDate(category.updated_at)}</p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="ghost"
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            onClick={() => {
              onClose();
              onDelete(category);
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(category);
              }}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Category
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryDetailsModal;
