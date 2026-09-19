import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  CheckCircle2,
  PauseCircle,
  Play,
  XCircle,
  Flame,
  Tag,
} from 'lucide-react';
import { Goal } from '../../types/goal';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface GoalCardProps {
  goal: Goal;
  currency?: string;
  onAddContribution: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onViewProgress: (goal: Goal) => void;
  onComplete: (goal: Goal) => void;
  onPause: (goal: Goal) => void;
  onResume: (goal: Goal) => void;
  onCancel: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  currency = 'USD',
  onAddContribution,
  onEdit,
  onDelete,
  onViewProgress,
  onComplete,
  onPause,
  onResume,
  onCancel,
}) => {
  const currentAmount = parseFloat(String(goal.current_amount || 0));
  const targetAmount = parseFloat(String(goal.target_amount || 0));
  const remainingAmount =
    goal.remaining_amount !== undefined
      ? goal.remaining_amount
      : Math.max(0, targetAmount - currentAmount);

  const percentage =
    goal.progress_percentage !== undefined
      ? goal.progress_percentage
      : targetAmount > 0
      ? Math.min(100, (currentAmount / targetAmount) * 100)
      : 0;

  const getStatusBadge = () => {
    switch (goal.status) {
      case 'COMPLETED':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'PAUSED':
        return <Badge variant="warning" size="sm">Paused</Badge>;
      case 'OVERDUE':
        return <Badge variant="danger" size="sm">Overdue</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary" size="sm">Cancelled</Badge>;
      case 'ACTIVE':
      default:
        return <Badge variant="info" size="sm">Active</Badge>;
    }
  };

  const getPriorityBadge = () => {
    if (!goal.priority) return null;
    const priorityMap: Record<string, 'danger' | 'warning' | 'secondary'> = {
      HIGH: 'danger',
      MEDIUM: 'warning',
      LOW: 'secondary',
    };
    return (
      <Badge variant={priorityMap[goal.priority] || 'secondary'} size="sm">
        {goal.priority}
      </Badge>
    );
  };

  const formatGoalType = (type?: string) => {
    if (!type) return 'Savings';
    return type
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card className="hover:border-slate-700 transition-all duration-200 flex flex-col justify-between bg-slate-900 border-slate-800">
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 inline-flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" />
                {formatGoalType(goal.goal_type)}
              </span>
              {getPriorityBadge()}
              {getStatusBadge()}
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">{goal.name}</h3>
            {goal.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{goal.description}</p>
            )}
          </div>
        </div>

        {/* Progress Bar & Amounts */}
        <div className="my-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-emerald-400">
              {formatCurrency(currentAmount, currency)}
            </span>
            <span className="text-xs text-slate-400">
              Target: <strong className="text-slate-200">{formatCurrency(targetAmount, currency)}</strong>
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                goal.status === 'COMPLETED' || percentage >= 100
                  ? 'bg-emerald-400'
                  : goal.status === 'PAUSED'
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-400">
              Remaining:{' '}
              <strong className="text-amber-400">{formatCurrency(remainingAmount, currency)}</strong>
            </span>
            <span className="font-bold text-emerald-400">{percentage.toFixed(0)}%</span>
          </div>
        </div>

        {/* Target Date & Category */}
        <div className="flex justify-between items-center text-xs text-slate-400 mb-4 px-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Target: {formatDate(goal.target_date)}</span>
          </div>
          {goal.category_name && (
            <span className="text-slate-400 truncate max-w-[120px]">
              Category: {goal.category_name}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewProgress(goal)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            View
          </Button>

          {goal.status !== 'COMPLETED' && goal.status !== 'CANCELLED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddContribution(goal)}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Contribute
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Status action toggle buttons */}
          {goal.status === 'ACTIVE' && (
            <>
              <button
                onClick={() => onComplete(goal)}
                title="Mark Completed"
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPause(goal)}
                title="Pause Goal"
                className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition"
              >
                <PauseCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {goal.status === 'PAUSED' && (
            <button
              onClick={() => onResume(goal)}
              title="Resume Goal"
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {goal.status !== 'CANCELLED' && goal.status !== 'COMPLETED' && (
            <button
              onClick={() => onCancel(goal)}
              title="Cancel Goal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onEdit(goal)}
            title="Edit Goal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(goal)}
            title="Delete Goal"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
