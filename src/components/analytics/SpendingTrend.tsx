import React, { useState } from 'react';
import Card from '../ui/Card';
import { TrendItem } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';

interface SpendingTrendProps {
  trends: TrendItem[];
  currency?: string;
  groupBy: 'daily' | 'weekly' | 'monthly';
  onGroupByChange: (group: 'daily' | 'weekly' | 'monthly') => void;
}

export const SpendingTrend: React.FC<SpendingTrendProps> = ({
  trends,
  currency = 'USD',
  groupBy,
  onGroupByChange,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrendItem | null>(null);

  if (!trends || trends.length === 0) {
    return (
      <Card
        title="Financial Trends"
        subtitle="Income vs Expense trend over time"
        headerAction={
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map((g) => (
              <button
                key={g}
                onClick={() => onGroupByChange(g)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  groupBy === g
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        }
      >
        <div className="py-12 text-center text-xs text-slate-400">
          No trend data available for the selected period.
        </div>
      </Card>
    );
  }

  // Calculate SVG dimensions and scale
  const maxIncome = Math.max(...trends.map((t) => t.income || 0), 1);
  const maxExpenses = Math.max(...trends.map((t) => t.expenses || 0), 1);
  const maxVal = Math.max(maxIncome, maxExpenses, 100);

  const chartHeight = 180;

  return (
    <Card
      title="Financial Trends"
      subtitle="Income vs Expenses trajectory"
      headerAction={
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Income
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Expenses
            </span>
          </div>

          {/* Granularity Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map((g) => (
              <button
                key={g}
                onClick={() => onGroupByChange(g)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  groupBy === g
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-4 my-2">
        {/* Tooltip Header if Point Hovered */}
        {hoveredPoint ? (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <span className="font-semibold text-white">{hoveredPoint.period || hoveredPoint.date || hoveredPoint.month}</span>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400">
                Income: <strong>{formatCurrency(hoveredPoint.income, currency)}</strong>
              </span>
              <span className="text-red-400">
                Expense: <strong>{formatCurrency(hoveredPoint.expenses, currency)}</strong>
              </span>
              <span className="text-teal-400">
                Net: <strong>{formatCurrency(hoveredPoint.net, currency)}</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Hover over bars to view detailed period figures
          </div>
        )}

        {/* Bar / Column Chart */}
        <div className="h-[200px] flex items-end justify-between gap-1.5 pt-4 pb-2 border-b border-slate-800/80 px-1 overflow-x-auto custom-scrollbar">
          {trends.map((item, index) => {
            const inc = item.income || 0;
            const exp = item.expenses || 0;

            const incHeightPct = (inc / maxVal) * 100;
            const expHeightPct = (exp / maxVal) * 100;

            const label = item.period || item.month || item.date || `#${index + 1}`;

            return (
              <div
                key={index}
                className="flex-1 min-w-[28px] max-w-[60px] h-full flex flex-col justify-end items-center group cursor-pointer"
                onMouseEnter={() => setHoveredPoint(item)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Bars side-by-side or stacked */}
                <div className="w-full flex items-end justify-center gap-1 h-[160px]">
                  {/* Income bar */}
                  <div className="w-1/2 bg-slate-800 rounded-t overflow-hidden h-full flex flex-col justify-end">
                    <div
                      className="bg-emerald-400 hover:bg-emerald-300 rounded-t transition-all duration-300"
                      style={{ height: `${Math.min(100, Math.max(2, incHeightPct))}%` }}
                    />
                  </div>

                  {/* Expense bar */}
                  <div className="w-1/2 bg-slate-800 rounded-t overflow-hidden h-full flex flex-col justify-end">
                    <div
                      className="bg-red-400 hover:bg-red-300 rounded-t transition-all duration-300"
                      style={{ height: `${Math.min(100, Math.max(2, expHeightPct))}%` }}
                    />
                  </div>
                </div>

                {/* Date Label */}
                <span className="text-[10px] text-slate-400 group-hover:text-white mt-2 truncate w-full text-center">
                  {label.length > 8 ? label.substring(0, 7) + '..' : label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default SpendingTrend;
