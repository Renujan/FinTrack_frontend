import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import EmptyState from '../common/EmptyState';
import { BarChart3, ArrowRight, TrendingDown, DollarSign } from 'lucide-react';
import { TopCategoryItem, SpendingInsights } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export interface SpendingAnalyticsWidgetProps {
  topCategories?: TopCategoryItem[];
  insights?: SpendingInsights;
}

export const SpendingAnalyticsWidget: React.FC<SpendingAnalyticsWidgetProps> = ({
  topCategories = [],
  insights,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const categoryList = topCategories || [];

  return (
    <Card
      title="Spending Analytics"
      subtitle="Top expense categories & insights"
      headerAction={
        categoryList.length > 0 ? (
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
          >
            <span>View analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : undefined
      }
    >
      {categoryList.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-slate-500" />}
          title="No spending data available yet"
          description="Add expense transactions to see your category spending breakdown."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/transactions')}
            >
              View Transactions
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Highlights Header */}
          {insights && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Avg Expense</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">
                  {formatCurrency(insights.average_expense, currency)}
                </p>
              </div>

              {insights.largest_recent_expense && (
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Largest Expense</span>
                  <p className="text-xs font-bold text-rose-400 truncate mt-0.5">
                    {formatCurrency(insights.largest_recent_expense.amount, currency)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Categories Breakdown List */}
          <div className="space-y-3">
            {categoryList.slice(0, 5).map((cat, idx) => {
              const spent = parseFloat(cat.spent) || 0;
              const percent = cat.percentage || 0;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-200">{formatCurrency(spent, currency)}</span>
                      <span className="text-slate-400 text-[10px]">({percent.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${Math.min(percent, 100)}%` }}
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

export default SpendingAnalyticsWidget;
