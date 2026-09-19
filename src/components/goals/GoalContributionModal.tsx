import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Goal, GoalContribution } from '../../types/goal';
import goalService from '../../services/goalService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PlusCircle, Trash2, Calendar, FileText } from 'lucide-react';

interface GoalContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onContributionAdded: () => void;
  currency?: string;
}

export const GoalContributionModal: React.FC<GoalContributionModalProps> = ({
  isOpen,
  onClose,
  goal,
  onContributionAdded,
  currency = 'USD',
}) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [contributionDate, setContributionDate] = useState('');

  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && goal) {
      setAmount('');
      setNote('');
      setContributionDate(new Date().toISOString().split('T')[0]);
      setError(null);
      fetchContributions();
    }
  }, [isOpen, goal]);

  const fetchContributions = async () => {
    if (!goal) return;
    try {
      setLoadingContributions(true);
      const data = await goalService.getContributions(goal.id);
      setContributions(data);
    } catch {
      setContributions([]);
    } finally {
      setLoadingContributions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setError(null);

    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError('Contribution amount must be greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      await goalService.addContribution(goal.id, {
        amount: val,
        note: note.trim() || undefined,
        contribution_date: contributionDate || undefined,
      });

      setAmount('');
      setNote('');
      fetchContributions();
      onContributionAdded();
    } catch (err: any) {
      const respData = err?.response?.data;
      if (respData && typeof respData === 'object') {
        const msg = Object.values(respData).flat().join(' ');
        setError(msg || 'Failed to add contribution.');
      } else {
        setError(err?.message || 'Failed to add contribution.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContribution = async (contributionId: number) => {
    if (!goal) return;
    try {
      await goalService.deleteContribution(goal.id, contributionId);
      fetchContributions();
      onContributionAdded();
    } catch (err: any) {
      setError('Failed to delete contribution.');
    }
  };

  if (!goal) return null;

  const currentAmount = parseFloat(String(goal.current_amount || 0));
  const targetAmount = parseFloat(String(goal.target_amount || 0));
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const percent = targetAmount > 0 ? Math.min(100, (currentAmount / targetAmount) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Contribution — ${goal.name}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Goal Overview Bar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-400">Current Progress</span>
            <span className="text-sm font-bold text-emerald-400">
              {formatCurrency(currentAmount, currency)} / {formatCurrency(targetAmount, currency)}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span>Remaining: <strong className="text-amber-400">{formatCurrency(remainingAmount, currency)}</strong></span>
            <span className="font-bold text-emerald-400">{percent.toFixed(0)}%</span>
          </div>
        </div>

        {/* New Contribution Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            New Deposit / Contribution
          </h4>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contribution Amount *"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />

            <Input
              label="Contribution Date"
              type="date"
              value={contributionDate}
              onChange={(e) => setContributionDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Note / Reference (Optional)"
            placeholder="e.g., Monthly savings deposit, Bonus allocation"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="flex justify-end">
            <Button variant="primary" type="submit" isLoading={isSubmitting} leftIcon={<PlusCircle className="w-4 h-4" />}>
              Add Contribution
            </Button>
          </div>
        </form>

        {/* Contribution History Table */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Contribution History ({contributions.length})
          </h4>

          {loadingContributions ? (
            <p className="text-xs text-slate-400">Loading contribution log...</p>
          ) : contributions.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center text-xs text-slate-400">
              No contributions recorded yet. Add your first deposit above.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {contributions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-emerald-400 text-sm">
                      +{formatCurrency(parseFloat(String(item.amount)), currency)}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(item.contribution_date || item.created_at)}
                      </span>
                      {item.note && (
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <FileText className="w-3 h-3 text-slate-400" />
                          {item.note}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteContribution(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Remove contribution"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GoalContributionModal;
