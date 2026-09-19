import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Goal } from '../../types/goal';
import { AlertTriangle } from 'lucide-react';

interface GoalDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (goalId: number) => Promise<void>;
  goal: Goal | null;
}

export const GoalDeleteModal: React.FC<GoalDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  goal,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!goal) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm(goal.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete financial goal.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Financial Goal" maxWidth="sm">
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-red-300">Are you sure you want to delete this goal?</p>
            <p className="text-red-400/90">
              Goal <strong className="text-white">"{goal.name}"</strong> will be permanently removed.
              Associated savings contributions logs will also be deleted.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete Goal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GoalDeleteModal;
