import React from 'react';
import Card from '../ui/Card';
import { CategoryAnalyticsItem } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryStyle } from '../../utils/categoryBadge';
import { PieChart, Tag, Sparkles } from 'lucide-react';

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
  const categoryList = Array.isArray(categories) ? categories : (categories as any)?.results || [];

  if (categoryList.length === 0) {
    return (
      <Card title="Spending by Category" subtitle="Expense distribution">
        <div className="py-8 text-center text-xs text-slate-400">
          No category spending recorded for this period.
        </div>
      </Card>
    );
  }

  const totalSpent = categoryList.reduce(
    (acc, item) => acc + (item.amount || item.spent || 0),
    0
  );

  return (
    <Card
      title="Spending by Category"
      subtitle="Expense category distribution"
      headerAction={
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
          <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          <span>{categoryList.length} Categories</span>
        </div>
      }
    >
      <div className="space-y-4 my-2">
        {categoryList.map((item, index) => {
          const amt = item.amount !== undefined ? item.amount : item.spent || 0;
          const pct =
            item.percentage !== undefined
              ? item.percentage
              : totalSpent > 0
              ? (amt / totalSpent) * 100
              : 0;

          const colorGradient = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          const catStyle = getCategoryStyle(item.category);

          return (
            <div key={item.category_id || index} className="space-y-1.5 group p-2 rounded-xl hover:bg-slate-950/40 transition-colors">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                    {item.category}
                  </span>
                  {item.transaction_count !== undefined && (
                    <span className="text-[10px] text-slate-400">
                      ({item.transaction_count} txns)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {formatCurrency(amt, currency)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 w-10 text-right bg-slate-800/80 px-1.5 py-0.5 rounded">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80 p-0.5">
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
