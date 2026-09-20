import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { UserPreference } from '../../types/settings';

interface NotificationPreferencesFormProps {
  preferences: UserPreference | null;
  onSave: (data: Partial<UserPreference>) => Promise<void>;
}

export const NotificationPreferencesForm: React.FC<NotificationPreferencesFormProps> = ({
  preferences,
  onSave,
}) => {
  const [budgetAlerts, setBudgetAlerts] = useState(preferences?.budget_alerts ?? true);
  const [goalAlerts, setGoalAlerts] = useState(preferences?.goal_alerts ?? true);
  const [recurringAlerts, setRecurringAlerts] = useState(
    preferences?.recurring_transaction_alerts ?? true
  );
  const [largeExpenseAlerts, setLargeExpenseAlerts] = useState(
    preferences?.large_expense_alerts_enabled ?? true
  );
  const [budgetThreshold, setBudgetThreshold] = useState(
    preferences?.budget_warning_threshold || 80
  );
  const [largeExpenseThreshold, setLargeExpenseThreshold] = useState(
    preferences?.large_expense_threshold || 500
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await onSave({
        budget_alerts: budgetAlerts,
        goal_alerts: goalAlerts,
        recurring_transaction_alerts: recurringAlerts,
        large_expense_alerts_enabled: largeExpenseAlerts,
        budget_warning_threshold: Number(budgetThreshold),
        large_expense_threshold: Number(largeExpenseThreshold),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Notification & System Alert Triggers" subtitle="Control automated alert thresholds and notification behavior">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl">
            Notification triggers saved successfully!
          </div>
        )}

        <div className="space-y-3">
          {[
            {
              id: 'budget',
              label: 'Budget Limit Alerts',
              desc: 'Notify when category spending exceeds threshold %',
              value: budgetAlerts,
              setter: setBudgetAlerts,
            },
            {
              id: 'goal',
              label: 'Savings Goal Milestones',
              desc: 'Notify on goal completion, overdue status, or target near',
              value: goalAlerts,
              setter: setGoalAlerts,
            },
            {
              id: 'recurring',
              label: 'Recurring Payment Reminders',
              desc: 'Notify when scheduled recurring transactions are generated or due',
              value: recurringAlerts,
              setter: setRecurringAlerts,
            },
            {
              id: 'large',
              label: 'Large Single Expense Warning',
              desc: 'Notify whenever an expense above threshold is recorded',
              value: largeExpenseAlerts,
              setter: setLargeExpenseAlerts,
            },
          ].map((toggle) => (
            <div
              key={toggle.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
            >
              <div>
                <p className="text-xs font-semibold text-slate-200">{toggle.label}</p>
                <p className="text-[11px] text-slate-400">{toggle.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={toggle.value}
                onChange={(e) => toggle.setter(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="Budget Warning Threshold (%)"
            type="number"
            min={1}
            max={100}
            value={budgetThreshold}
            onChange={(e) => setBudgetThreshold(Number(e.target.value))}
            helperText="Default: 80%"
          />
          <Input
            label="Large Expense Threshold ($)"
            type="number"
            min={0}
            value={largeExpenseThreshold}
            onChange={(e) => setLargeExpenseThreshold(Number(e.target.value))}
            helperText="Default: $500.00"
          />
        </div>

        <Button variant="primary" size="sm" type="submit" isLoading={loading}>
          Save Alert Preferences
        </Button>
      </form>
    </Card>
  );
};

export default NotificationPreferencesForm;
