import React from 'react';
import Card from '../ui/Card';
import { CategorySummaryMetrics } from '../../types/category';
import { Tag, CheckCircle2, ArrowRightLeft } from 'lucide-react';

interface CategorySummaryProps {
  metrics: CategorySummaryMetrics;
  isLoading?: boolean;
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse h-24 bg-slate-900/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="flex items-center space-x-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Total Categories</p>
          <h4 className="text-2xl font-bold text-slate-100">{metrics.totalCategories}</h4>
        </div>
      </Card>

      <Card className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Active Filtered</p>
          <h4 className="text-2xl font-bold text-slate-100">{metrics.filteredCount}</h4>
        </div>
      </Card>

      <Card className="flex items-center space-x-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
          <ArrowRightLeft className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Linked Transactions</p>
          <h4 className="text-2xl font-bold text-slate-100">{metrics.totalTransactionsLinked}</h4>
        </div>
      </Card>
    </div>
  );
};

export default CategorySummary;
