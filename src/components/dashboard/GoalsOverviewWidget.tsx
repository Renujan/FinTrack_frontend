import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import EmptyState from '../common/EmptyState';
import { Target, ArrowRight, Plus, CheckCircle2 } from 'lucide-react';
import { GoalOverview } from '../../types/dashboard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export interface GoalsOverviewWidgetProps {
  goalOverview?: GoalOverview;
}

export const GoalsOverviewWidget: React.FC<GoalsOverviewWidgetProps> = ({
  goalOverview,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const goals = goalOverview?.goals_summary || [];

  return (
    <Card
      title="Financial Goals"
      subtitle="Savings targets & milestone progress"
      headerAction={
        goals.length > 0 ? (
          <button
            onClick={() => navigate('/goals')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
          >
            <span>View goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : undefined
      }
    >
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8 text-slate-500" />}
          title="No financial goals yet"
          description="Create savings targets for emergency funds, major purchases, or investments."
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/goals')}
            >
              Create Goal
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Overall Goal Progress Bar */}
          {goalOverview && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Total Saved Across Goals</span>
                <span className="font-bold text-emerald-400">
                  {goalOverview.overall_progress_percentage.toFixed(0)}% Complete
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200">
                {formatCurrency(goalOverview.total_saved_amount, currency)} /{' '}
                {formatCurrency(goalOverview.total_target_amount, currency)}
              </p>
            </div>
          )}

          {/* Goal items */}
          <div className="space-y-3">
            {goals.slice(0, 3).map((goal) => {
              const current = parseFloat(goal.current_amount) || 0;
              const target = parseFloat(goal.target_amount) || 0;
              const percent = Math.min(goal.percentage_complete || (target > 0 ? (current / target) * 100 : 0), 100);

              return (
                <div key={goal.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        {goal.name}
                        {goal.is_completed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Target Date: {formatDate(goal.target_date)}
                      </p>
                    </div>

                    <Badge
                      variant={goal.is_completed ? 'success' : goal.is_near_completion ? 'info' : 'secondary'}
                      size="sm"
                    >
                      {percent.toFixed(0)}%
                    </Badge>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Saved: {formatCurrency(current, currency)}</span>
                    <span>Target: {formatCurrency(target, currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default GoalsOverviewWidget;
