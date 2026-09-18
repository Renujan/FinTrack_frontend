import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Category } from '../../types/category';
import { RecurringTransaction, RecurringTransactionFormData, RecurrenceFrequency } from '../../types/recurring';
import { Calendar, DollarSign, FileText, Tag, Repeat, Clock } from 'lucide-react';

interface RecurringTransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: RecurringTransactionFormData) => Promise<void>;
  initialData?: RecurringTransaction | null;
  categories: Category[];
  isLoading?: boolean;
  externalError?: string | null;
  fieldErrors?: Record<string, string>;
}

/**
 * Recurring Transaction Form Modal for Creation & Editing
 */
export const RecurringTransactionFormModal: React.FC<RecurringTransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  isLoading = false,
  externalError,
  fieldErrors = {},
}) => {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [categoryId, setCategoryId] = useState<string>('');
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('MONTHLY');
  const [interval, setInterval] = useState<string>('1');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [nextRunDate, setNextRunDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Populate form fields on open or initialData change
  useEffect(() => {
    if (isOpen) {
      setLocalErrors({});
      if (initialData) {
        setName(initialData.name || initialData.title || '');
        setAmount(String(initialData.amount || ''));
        setTransactionType(initialData.transaction_type || 'EXPENSE');
        setCategoryId(String(initialData.category || ''));
        setFrequency(initialData.frequency || 'MONTHLY');
        setInterval(String(initialData.interval || 1));
        setStartDate(initialData.start_date || '');
        setEndDate(initialData.end_date || '');
        setNextRunDate(initialData.next_run_date || '');
        setDescription(initialData.description || '');
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        setName('');
        setAmount('');
        setTransactionType('EXPENSE');
        setCategoryId(categories.length > 0 ? String(categories[0].id) : '');
        setFrequency('MONTHLY');
        setInterval('1');
        setStartDate(todayStr);
        setEndDate('');
        setNextRunDate(todayStr);
        setDescription('');
      }
    }
  }, [isOpen, initialData, categories]);

  // Client-side validation before submitting
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Name is required.';
    } else if (name.trim().length > 100) {
      errs.name = 'Name cannot exceed 100 characters.';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Amount must be a positive number greater than 0.';
    }

    if (!categoryId) {
      errs.category = 'Please select a valid category.';
    }

    const numInterval = parseInt(interval, 10);
    if (!interval || isNaN(numInterval) || numInterval < 1) {
      errs.interval = 'Interval must be a positive integer (minimum 1).';
    }

    if (!startDate) {
      errs.start_date = 'Start date is required.';
    }

    if (startDate && endDate && endDate < startDate) {
      errs.end_date = 'End date cannot be before start date.';
    }

    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: RecurringTransactionFormData = {
      name: name.trim(),
      amount: parseFloat(amount),
      transaction_type: transactionType,
      category: Number(categoryId),
      frequency,
      interval: parseInt(interval, 10) || 1,
      start_date: startDate,
      end_date: endDate ? endDate : null,
      next_run_date: nextRunDate ? nextRunDate : startDate,
      description: description.trim(),
    };

    await onSubmit(payload);
  };

  const combinedError = (field: string) => fieldErrors[field] || localErrors[field];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Recurring Schedule' : 'Create Recurring Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Global Error Alert */}
        {externalError && <ErrorMessage message={externalError} className="mb-2" />}

        {/* Transaction Type Switch (Income / Expense) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTransactionType('EXPENSE')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                transactionType === 'EXPENSE'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('INCOME')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                transactionType === 'INCOME'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Name / Title */}
        <Input
          label="Title / Name"
          placeholder="e.g., Netflix Subscription, Monthly Salary, Rent"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={combinedError('name') || combinedError('title')}
          leftIcon={<Tag className="w-4 h-4 text-slate-400" />}
          required
        />

        {/* Amount & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={combinedError('amount')}
            leftIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full bg-slate-950 border ${
                combinedError('category') ? 'border-rose-500' : 'border-slate-800'
              } rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors`}
              required
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
            {combinedError('category') && (
              <p className="text-xs text-rose-400 mt-1">{combinedError('category')}</p>
            )}
          </div>
        </div>

        {/* Frequency & Interval Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Frequency <span className="text-rose-400">*</span>
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
              className={`w-full bg-slate-950 border ${
                combinedError('frequency') ? 'border-rose-500' : 'border-slate-800'
              } rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors`}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
            {combinedError('frequency') && (
              <p className="text-xs text-rose-400 mt-1">{combinedError('frequency')}</p>
            )}
          </div>

          <Input
            label="Interval Multiplier"
            type="number"
            min="1"
            placeholder="1"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            error={combinedError('interval')}
            leftIcon={<Repeat className="w-4 h-4 text-slate-400" />}
            helperText="e.g. Interval 2 with Monthly = Every 2 Months"
            required
          />
        </div>

        {/* Dates Row: Start Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (!nextRunDate || !isEditing) {
                setNextRunDate(e.target.value);
              }
            }}
            error={combinedError('start_date')}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="End Date (Optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            error={combinedError('end_date')}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            helperText="Leave empty for ongoing schedule"
          />
        </div>

        {/* Next Run Date (Optional) */}
        <Input
          label="Next Run Date"
          type="date"
          value={nextRunDate}
          onChange={(e) => setNextRunDate(e.target.value)}
          error={combinedError('next_run_date')}
          leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
          helperText="Date of next automated execution"
        />

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description / Notes (Optional)
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              placeholder="Add optional notes or descriptions for this recurring item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          {combinedError('description') && (
            <p className="text-xs text-rose-400 mt-1">{combinedError('description')}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Recurring Rule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RecurringTransactionFormModal;
