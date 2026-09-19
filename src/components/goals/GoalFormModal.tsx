import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Goal, GoalPriority, GoalType } from '../../types/goal';
import { Category } from '../../types/category';
import categoryService from '../../services/categoryService';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Goal>) => Promise<void>;
  goal?: Goal | null;
}

const GOAL_TYPES: { value: GoalType; label: string }[] = [
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'EMERGENCY_FUND', label: 'Emergency Fund' },
  { value: 'PURCHASE', label: 'Purchase' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'DEBT_REPAYMENT', label: 'Debt Repayment' },
  { value: 'OTHER', label: 'Other' },
];

const PRIORITIES: { value: GoalPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('SAVINGS');
  const [priority, setPriority] = useState<GoalPriority>('MEDIUM');
  const [categoryId, setCategoryId] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (goal) {
        setName(goal.name || '');
        setDescription(goal.description || '');
        setTargetAmount(String(goal.target_amount || ''));
        setCurrentAmount(String(goal.current_amount || '0'));
        setTargetDate(goal.target_date || '');
        setGoalType(goal.goal_type || 'SAVINGS');
        setPriority(goal.priority || 'MEDIUM');
        setCategoryId(goal.category ? String(goal.category) : '');
      } else {
        // Reset defaults
        setName('');
        setDescription('');
        setTargetAmount('');
        setCurrentAmount('0');

        // Set default date to 6 months from today
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 6);
        setTargetDate(defaultDate.toISOString().split('T')[0]);

        setGoalType('SAVINGS');
        setPriority('MEDIUM');
        setCategoryId('');
      }
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, goal]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch {
      // Ignore category load error if unauthenticated/empty
    } finally {
      setLoadingCategories(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Goal name cannot exceed 100 characters';
    }

    const targetVal = parseFloat(targetAmount);
    if (!targetAmount || isNaN(targetVal) || targetVal <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than zero';
    }

    const currentVal = parseFloat(currentAmount);
    if (currentAmount && (isNaN(currentVal) || currentVal < 0)) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    }

    if (!targetDate) {
      newErrors.targetDate = 'Target date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const payload: Partial<Goal> = {
        name: name.trim(),
        description: description.trim(),
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount || '0'),
        target_date: targetDate,
        goal_type: goalType,
        priority: priority,
        category: categoryId ? parseInt(categoryId, 10) : null,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      const respData = err?.response?.data;
      if (respData && typeof respData === 'object') {
        const fieldErrors: Record<string, string> = {};
        let msg = '';
        Object.keys(respData).forEach((key) => {
          const val = respData[key];
          const valStr = Array.isArray(val) ? val.join(' ') : String(val);
          fieldErrors[key] = valStr;
          msg += `${key}: ${valStr} `;
        });
        setErrors(fieldErrors);
        setServerError(msg || 'Failed to save financial goal.');
      } else {
        setServerError(err?.message || 'An error occurred while saving the goal.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal ? 'Edit Financial Goal' : 'Create Financial Goal'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {serverError}
          </div>
        )}

        <Input
          label="Goal Name *"
          placeholder="e.g., Emergency Fund, New Car, Vacation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
        />

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            rows={2}
            placeholder="Add details about your target savings..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Target Amount *"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            error={errors.targetAmount}
            disabled={isSubmitting}
          />

          <Input
            label="Initial Current Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            error={errors.currentAmount}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Target Date *"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            error={errors.targetDate}
            disabled={isSubmitting}
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Goal Type</label>
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value as GoalType)}
              disabled={isSubmitting}
            >
              {GOAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value as GoalPriority)}
              disabled={isSubmitting}
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category (Optional)</label>
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isSubmitting || loadingCategories}
            >
              <option value="">No Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {goal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalFormModal;
