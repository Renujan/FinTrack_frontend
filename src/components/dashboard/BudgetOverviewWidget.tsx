import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import EmptyState from '../common/EmptyState';
import { PieChart, ArrowRight, Plus, AlertTriangle } from 'lucide-react';
import { BudgetOverview } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export interface BudgetOverviewWidgetProps {
  budgetOverview?: BudgetOverview;
}

export const BudgetOverviewWidget: React.FC<BudgetOverviewWidgetProps> = ({
  budgetOverview,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const budgets = budgetOverview?.budgets_summary || [];

  return (
    <Card
      title="Budget Overview"
      subtitle="Monthly spending limits & utilization"
      headerAction={
        budgets.length > 0 ? (
          <button
            onClick={() => navigate('/budgets')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
          >
            <span>View budgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : undefined
      }
    >
      {budgets.length === 0 ? (
        <EmptyState
          icon={<PieChart className="w-8 h-8 text-slate-500" />}
          title="No budgets created yet"
          description="Set spending budgets for your categories to stay on track."
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/budgets')}
            >
              Create Budget
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Overall summary bar */}
          {budgetOverview && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">Total Spent / Budgeted</p>
                <p className="text-sm font-bold text-slate-200">
                  {formatCurrency(budgetOverview.total_spent_amount, currency)} /{' '}
                  {formatCurrency(budgetOverview.total_budget_amount, currency)}
                </p>
              </div>
              <Badge
                variant={
                  budgetOverview.exceeded_budgets > 0
                    ? 'danger'
                    : budgetOverview.overall_utilization_percentage >= 85
                    ? 'warning'
                    : 'success'
                }
                size="sm"
              >
                {budgetOverview.overall_utilization_percentage.toFixed(0)}% Used
              </Badge>
            </div>
          )}

          {/* Budget items list */}
          <div className="space-y-3">
            {budgets.slice(0, 4).map((budget) => {
              const spent = parseFloat(budget.spent_amount) || 0;
              const limit = parseFloat(budget.budget_amount) || 0;
              const percent = Math.min(budget.percentage_used || (limit > 0 ? (spent / limit) * 100 : 0), 100);

              let progressColor = 'bg-emerald-400';
              if (budget.is_exceeded) {
                progressColor = 'bg-rose-500';
              } else if (budget.is_near_limit || percent >= 80) {
                progressColor = 'bg-amber-400';
              }

              return (
                <div key={budget.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      {budget.name}
                      {budget.is_exceeded && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
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

export default BudgetOverviewWidget;
