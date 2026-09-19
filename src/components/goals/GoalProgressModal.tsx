import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Goal, GoalProgressForecast } from '../../types/goal';
import goalService from '../../services/goalService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface GoalProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  currency?: string;
}

export const GoalProgressModal: React.FC<GoalProgressModalProps> = ({
  isOpen,
  onClose,
  goal,
  currency = 'USD',
}) => {
  const [forecast, setForecast] = useState<GoalProgressForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && goal) {
      loadForecast();
    } else {
      setForecast(null);
    }
  }, [isOpen, goal]);

  const loadForecast = async () => {
    if (!goal) return;
    try {
      setLoading(true);
      setError(null);
      const data = await goalService.getGoalProgress(goal.id);
      setForecast(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to load goal progress forecast.');
    } finally {
      setLoading(false);
    }
  };

  if (!goal) return null;

  const currentAmount = parseFloat(String(goal.current_amount || 0));
  const targetAmount = parseFloat(String(goal.target_amount || 0));
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const percentage = forecast?.progress_percentage ?? (targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Goal Details & Forecast — ${goal.name}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Top Summary Header */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-xs text-slate-400">Target Goal</span>
              <h3 className="text-lg font-bold text-white">{goal.name}</h3>
              {goal.description && (
                <p className="text-xs text-slate-400 mt-0.5">{goal.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={goal.status === 'COMPLETED' ? 'success' : goal.status === 'PAUSED' ? 'warning' : 'info'}>
                {goal.status || 'ACTIVE'}
              </Badge>
              {goal.priority && (
                <Badge variant={goal.priority === 'HIGH' ? 'danger' : goal.priority === 'MEDIUM' ? 'warning' : 'secondary'}>
                  {goal.priority}
                </Badge>
              )}
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Saved</span>
              <span className="font-bold text-emerald-400">{formatCurrency(currentAmount, currency)}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Target</span>
              <span className="font-bold text-slate-200">{formatCurrency(targetAmount, currency)}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Remaining</span>
              <span className="font-bold text-amber-400">{formatCurrency(remainingAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Forecast Details */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Calculating savings rate and forecast parameters...
          </div>
        ) : error ? (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : forecast ? (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Savings Pace & Rate Requirements
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Monthly Required
                </span>
                <p className="text-lg font-bold text-white mt-1">
                  {formatCurrency(forecast.required_monthly_saving, currency)}
                </p>
                <span className="text-[10px] text-slate-400">per month to reach target</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  Weekly Required
                </span>
                <p className="text-lg font-bold text-white mt-1">
                  {formatCurrency(forecast.required_weekly_saving, currency)}
                </p>
                <span className="text-[10px] text-slate-400">per week to stay on track</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Daily Required
                </span>
                <p className="text-lg font-bold text-white mt-1">
                  {formatCurrency(forecast.required_daily_saving, currency)}
                </p>
                <span className="text-[10px] text-slate-400">per day allocation</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Completion Date:</span>
                <strong className="text-slate-200">{formatDate(goal.target_date)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Days Remaining:</span>
                <strong className="text-emerald-400">{forecast.days_remaining} Days</strong>
              </div>
              {forecast.projected_completion_date && (
                <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Projected Completion Date:</span>
                  <strong className="text-teal-400">{formatDate(forecast.projected_completion_date)}</strong>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GoalProgressModal;
