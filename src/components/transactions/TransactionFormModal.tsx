import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Category, Transaction, TransactionFormData, TransactionType } from '../../types/transaction';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  initialData?: Transaction | null;
  categories: Category[];
  isLoading?: boolean;
  externalError?: string | null;
  fieldErrors?: Record<string, string>;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  isLoading = false,
  externalError,
  fieldErrors = {},
}) => {
  const isEdit = Boolean(initialData);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_type: 'EXPENSE',
    description: '',
    amount: '',
    category: '',
    date: getTodayDateString(),
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        transaction_type: initialData.transaction_type,
        description: initialData.description || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        date: initialData.date || getTodayDateString(),
      });
    } else {
      setFormData({
        transaction_type: 'EXPENSE',
        description: '',
        amount: '',
        category: categories.length > 0 ? categories[0].id : '',
        date: getTodayDateString(),
      });
    }
    setClientErrors({});
  }, [initialData, isOpen, categories]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }

    const numericAmount = parseFloat(String(formData.amount));
    if (!formData.amount || isNaN(numericAmount) || numericAmount <= 0) {
      errors.amount = 'Amount must be greater than zero.';
    }

    if (!formData.category) {
      errors.category = 'Please select a category.';
    }

    if (!formData.date) {
      errors.date = 'Date is required.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: TransactionFormData = {
      ...formData,
      amount: parseFloat(String(formData.amount)),
      category: Number(formData.category),
    };

    await onSubmit(payload);
  };

  const combinedErrors = { ...clientErrors, ...fieldErrors };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'New Transaction'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {externalError && <ErrorMessage message={externalError} />}

        {/* Transaction Type Segment Control */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transaction_type: 'EXPENSE' })}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
                formData.transaction_type === 'EXPENSE'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" /> Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transaction_type: 'INCOME' })}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
                formData.transaction_type === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" /> Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={combinedErrors.amount}
          disabled={isLoading}
          required
        />

        {/* Description */}
        <Input
          label="Description"
          type="text"
          placeholder="e.g. Grocery shopping, Monthly Salary"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={combinedErrors.description}
          disabled={isLoading}
          required
        />

        {/* Category Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Category</label>
          <select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            disabled={isLoading}
            className={`w-full bg-slate-900/90 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${
              combinedErrors.category ? 'border-rose-500/80' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {combinedErrors.category && (
            <p className="text-xs text-rose-400 font-medium mt-1">{combinedErrors.category}</p>
          )}
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={combinedErrors.date}
          disabled={isLoading}
          required
        />

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" size="md" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
