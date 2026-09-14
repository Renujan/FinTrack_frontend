import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Category, CategoryFormData } from '../../types/category';
import parseApiError from '../../utils/errorHandler';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  categoryToEdit?: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
}) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(categoryToEdit);

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setName(categoryToEdit.name);
      } else {
        setName('');
      }
      setNameError(null);
      setServerError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, categoryToEdit]);

  const validate = (): boolean => {
    let isValid = true;
    setNameError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Category name is required.');
      isValid = false;
    } else if (trimmed.length > 100) {
      setNameError('Category name cannot exceed 100 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim() });
      onClose();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to save category. Please check details.');
      if (parsed.fieldErrors?.name) {
        setNameError(parsed.fieldErrors.name);
      } else {
        setServerError(parsed.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Create New Category'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && <ErrorMessage message={serverError} />}

        <Input
          label="Category Name *"
          placeholder="e.g. Groceries, Subscriptions, Salary"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(null);
          }}
          error={nameError || undefined}
          helperText="Enter a unique name up to 100 characters."
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
