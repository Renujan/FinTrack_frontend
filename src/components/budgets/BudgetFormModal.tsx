import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Budget, BudgetFormData, BudgetPeriod } from '../../types/budget';
import { Category } from '../../types/category';
import parseApiError from '../../utils/errorHandler';
import { FormFieldErrors } from '../../types/user';
import { Calendar, DollarSign, Tag, Layers, AlertTriangle } from 'lucide-react';

export interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: BudgetFormData) => Promise<void>;
  initialData?: Budget | null;
  categories: Category[];
}

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}) => {
  const isEditing = Boolean(initialData);

  // Helper to format Date to YYYY-MM-DD
  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to calculate default dates based on period
  const getDefaultDatesForPeriod = (period: BudgetPeriod) => {
    const today = new Date();
    if (period === 'MONTHLY') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        start_date: formatDateToISO(start),
        end_date: formatDateToISO(end),
      };
    } else if (period === 'WEEKLY') {
      const currentDay = today.getDay(); // 0 is Sunday
      const diffToMonday = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const start = new Date(today.setDate(diffToMonday));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return {
        start_date: formatDateToISO(start),
        end_date: formatDateToISO(end),
      };
    } else {
      // Custom default: current month
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        start_date: formatDateToISO(start),
        end_date: formatDateToISO(end),
      };
    }
  };

  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    amount: '',
    period: 'MONTHLY',
    category: null,
    start_date: getDefaultDatesForPeriod('MONTHLY').start_date,
    end_date: getDefaultDatesForPeriod('MONTHLY').end_date,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        period: initialData.period || 'MONTHLY',
        category: initialData.category !== undefined ? initialData.category : null,
        start_date: initialData.start_date || getDefaultDatesForPeriod('MONTHLY').start_date,
        end_date: initialData.end_date || getDefaultDatesForPeriod('MONTHLY').end_date,
      });
    } else {
      const defaultDates = getDefaultDatesForPeriod('MONTHLY');
      setFormData({
        name: '',
        amount: '',
        period: 'MONTHLY',
        category: null,
        start_date: defaultDates.start_date,
        end_date: defaultDates.end_date,
      });
    }
    setGeneralError(null);
    setFieldErrors({});
  }, [initialData, isOpen]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as BudgetPeriod;
    const defaults = getDefaultDatesForPeriod(newPeriod);
    setFormData((prev) => ({
      ...prev,
      period: newPeriod,
      start_date: defaults.start_date,
      end_date: defaults.end_date,
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormFieldErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Budget name is required.';
    } else if (formData.name.length > 100) {
      errors.name = 'Budget name cannot exceed 100 characters.';
    }

    const numAmt = parseFloat(String(formData.amount));
    if (isNaN(numAmt) || numAmt <= 0) {
      errors.amount = 'Amount must be greater than zero.';
    }

    if (!formData.start_date) {
      errors.start_date = 'Start date is required.';
    }
    if (!formData.end_date) {
      errors.end_date = 'End date is required.';
    }
    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      errors.end_date = 'End date cannot be before start date.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to save budget. Please check inputs.');
      setGeneralError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Budget' : 'Create New Budget'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Budget Name */}
        <Input
          label="Budget Name *"
          placeholder="e.g. Monthly Groceries & Dining"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={fieldErrors.name}
          leftIcon={<Layers className="w-4 h-4" />}
          maxLength={100}
          required
        />

        {/* Scope / Category */}
        <div className="space-y-1.5">
          <label htmlFor="budget-category" className="block text-xs font-medium text-slate-300">
            Category Scope
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <select
              id="budget-category"
              value={formData.category === null || formData.category === undefined ? '' : String(formData.category)}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, category: val === '' ? null : Number(val) });
              }}
              className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="">Overall Budget (Applies to all expenses)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.category ? (
            <p className="text-xs text-rose-400 font-medium mt-1">{fieldErrors.category}</p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">
              Select a specific category or leave as Overall Budget to cap all expenses.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount / Limit */}
          <Input
            label="Budget Limit Amount *"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={fieldErrors.amount}
            leftIcon={<DollarSign className="w-4 h-4" />}
            required
          />

          {/* Period */}
          <div className="space-y-1.5">
            <label htmlFor="budget-period" className="block text-xs font-medium text-slate-300">
              Budget Period *
            </label>
            <select
              id="budget-period"
              value={formData.period}
              onChange={handlePeriodChange}
              className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="CUSTOM">Custom Period</option>
            </select>
            {fieldErrors.period && (
              <p className="text-xs text-rose-400 font-medium mt-1">{fieldErrors.period}</p>
            )}
          </div>
        </div>

        {/* Start & End Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date *"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            error={fieldErrors.start_date}
            leftIcon={<Calendar className="w-4 h-4" />}
            required
          />

          <Input
            label="End Date *"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            error={fieldErrors.end_date}
            leftIcon={<Calendar className="w-4 h-4" />}
            required
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetFormModal;
