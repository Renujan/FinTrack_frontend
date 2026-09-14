import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Category, CategoryStats } from '../../types/category';
import { AlertTriangle } from 'lucide-react';
import parseApiError from '../../utils/errorHandler';

interface CategoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  category: Category | null;
  stats?: CategoryStats;
}

export const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  category,
  stats,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!category) return null;

  const txCount = stats ? stats.transaction_count : 0;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await onConfirm(category.id);
      onClose();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to delete category.');
      setError(parsed.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Category"
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && <ErrorMessage message={error} />}

        <div className="flex items-start gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-100 text-sm">
              Confirm Category Deletion
            </h4>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong className="text-white">{category.name}</strong>?
            </p>
            {txCount > 0 && (
              <p className="text-xs text-rose-300 font-medium pt-1">
                Note: This category has {txCount} linked transaction(s). Backend security policy will protect and prevent deletion of active categories in use.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
          <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Category'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryDeleteModal;
