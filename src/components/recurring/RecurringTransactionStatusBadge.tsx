import React from 'react';
import Badge from '../ui/Badge';
import { RecurrenceFrequency } from '../../types/recurring';
import { Calendar, Clock, AlertTriangle, Play, Pause } from 'lucide-react';

interface RecurringTransactionStatusBadgeProps {
  isActive: boolean;
  frequency?: RecurrenceFrequency;
  interval?: number;
  nextRunDate?: string;
  showScheduleInfo?: boolean;
}

export const formatFrequencyText = (frequency?: RecurrenceFrequency, interval = 1): string => {
  if (!frequency) return 'Recurring';
  const mult = interval > 1 ? `${interval} ` : '';
  const plural = interval > 1 ? 's' : '';

  switch (frequency) {
    case 'DAILY':
      return interval === 1 ? 'Daily' : `Every ${mult}days`;
    case 'WEEKLY':
      return interval === 1 ? 'Weekly' : `Every ${mult}weeks`;
    case 'MONTHLY':
      return interval === 1 ? 'Monthly' : `Every ${mult}months`;
    case 'YEARLY':
      return interval === 1 ? 'Yearly' : `Every ${mult}years`;
    case 'CUSTOM':
      return `Custom (${mult}period${plural})`;
    default:
      return frequency;
  }
};

export const getNextDueDateStatus = (nextRunDate?: string): {
  label: string;
  variant: 'danger' | 'warning' | 'info' | 'neutral';
  isOverdue: boolean;
} => {
  if (!nextRunDate) {
    return { label: 'No scheduled date', variant: 'neutral', isOverdue: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(nextRunDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Past due (${Math.abs(diffDays)}d ago)`,
      variant: 'danger',
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return { label: 'Due today', variant: 'warning', isOverdue: true };
  } else if (diffDays === 1) {
    return { label: 'Due tomorrow', variant: 'info', isOverdue: false };
  } else if (diffDays <= 7) {
    return { label: `Due in ${diffDays} days`, variant: 'info', isOverdue: false };
  } else {
    return { label: `Next: ${nextRunDate}`, variant: 'neutral', isOverdue: false };
  }
};

export const RecurringTransactionStatusBadge: React.FC<RecurringTransactionStatusBadgeProps> = ({
  isActive,
  frequency,
  interval = 1,
  nextRunDate,
  showScheduleInfo = true,
}) => {
  const dueInfo = getNextDueDateStatus(nextRunDate);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Active / Paused Status */}
      {isActive ? (
        <Badge variant="success" size="sm" className="flex items-center gap-1">
          <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
          Active
        </Badge>
      ) : (
        <Badge variant="warning" size="sm" className="flex items-center gap-1">
          <Pause className="w-3 h-3 text-amber-400" />
          Paused
        </Badge>
      )}

      {/* Recurrence Frequency */}
      {showScheduleInfo && frequency && (
        <Badge variant="neutral" size="sm" className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {formatFrequencyText(frequency, interval)}
        </Badge>
      )}

      {/* Next Execution Schedule indicator */}
      {showScheduleInfo && isActive && nextRunDate && (
        <Badge
          variant={dueInfo.variant}
          size="sm"
          className="flex items-center gap-1"
        >
          {dueInfo.isOverdue ? (
            <AlertTriangle className="w-3 h-3" />
          ) : (
            <Calendar className="w-3 h-3" />
          )}
          {dueInfo.label}
        </Badge>
      )}
    </div>
  );
};

export default RecurringTransactionStatusBadge;
