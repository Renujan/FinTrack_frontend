import React from 'react';
import Card from '../ui/Card';
import { CategoryAnalyticsItem } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Tag } from 'lucide-react';

interface SpendingByCategoryProps {
  categories: CategoryAnalyticsItem[];
  currency?: string;
}

const CATEGORY_COLORS = [
  'from-emerald-500 to-teal-400',
  'from-blue-500 to-cyan-400',
  'from-indigo-500 to-purple-400',
  'from-amber-500 to-orange-400',
  'from-pink-500 to-rose-400',
  'from-teal-500 to-emerald-400',
  'from-sky-500 to-blue-400',
];

export const SpendingByCategory: React.FC<SpendingByCategoryProps> = ({
  categories,
  currency = 'USD',
}) => {
  if (!categories || categories.length === 0) {
    return (
      <Card title="Spending by Category" subtitle="Expense distribution">
        <div className="py-8 text-center text-xs text-slate-400">
          No category spending recorded for this period.
        </div>
      </Card>
    );
  }

  const totalSpent = categories.reduce(
    (acc, item) => acc + (item.amount || item.spent || 0),
    0
  );

  return (
    <Card
      title="Spending by Category"
      subtitle="Expense category distribution"
      headerAction={
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          <span>{categories.length} Categories</span>
        </div>
      }
    >
      <div className="space-y-4 my-2">
        {categories.map((item, index) => {
          const amt = item.amount !== undefined ? item.amount : item.spent || 0;
          const pct =
            item.percentage !== undefined
              ? item.percentage
              : totalSpent > 0
              ? (amt / totalSpent) * 100
              : 0;

          const colorGradient = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

          return (
            <div key={item.category_id || index} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${colorGradient}`} />
                  <span className="font-semibold text-slate-200">{item.category}</span>
                  {item.transaction_count !== undefined && (
                    <span className="text-[10px] text-slate-400">
                      ({item.transaction_count} txns)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">
                    {formatCurrency(amt, currency)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 w-10 text-right">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colorGradient} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(1, pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SpendingByCategory;
