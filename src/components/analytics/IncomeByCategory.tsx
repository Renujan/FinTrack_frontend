import React from 'react';
import Card from '../ui/Card';
import { IncomeCategoryAnalyticsItem } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';

interface IncomeByCategoryProps {
  categories: IncomeCategoryAnalyticsItem[];
  currency?: string;
}

export const IncomeByCategory: React.FC<IncomeByCategoryProps> = ({
  categories,
  currency = 'USD',
}) => {
  if (!categories || categories.length === 0) {
    return (
      <Card title="Income by Category" subtitle="Income sources distribution">
        <div className="py-8 text-center text-xs text-slate-400">
          No income category data recorded for this period.
        </div>
      </Card>
    );
  }

  const totalIncome = categories.reduce(
    (acc, item) => acc + (item.amount || item.income || 0),
    0
  );

  return (
    <Card
      title="Income Sources"
      subtitle="Income category breakdown"
      headerAction={
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          <span>{categories.length} Sources</span>
        </div>
      }
    >
      <div className="space-y-4 my-2">
        {categories.map((item, index) => {
          const amt = item.amount !== undefined ? item.amount : item.income || 0;
          const pct =
            item.percentage !== undefined
              ? item.percentage
              : totalIncome > 0
              ? (amt / totalIncome) * 100
              : 0;

          return (
            <div key={item.category_id || index} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">{item.category}</span>
                  {item.transaction_count !== undefined && (
                    <span className="text-[10px] text-slate-400">
                      ({item.transaction_count} txns)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(amt, currency)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 w-10 text-right">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
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

export default IncomeByCategory;
