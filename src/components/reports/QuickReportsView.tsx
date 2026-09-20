import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import reportService from '../../services/reportService';
import { QuickReportSummary } from '../../types/report';
import { DollarSign, TrendingUp, TrendingDown, Target, Wallet, BarChart2 } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

export const QuickReportsView: React.FC = () => {
  const [summary, setSummary] = useState<QuickReportSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuickSummary = async () => {
      try {
        const data = await reportService.getQuickSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load quick report summary', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuickSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="md" label="Loading financial summary..." />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Income</p>
            <h4 className="text-lg font-bold text-emerald-400 mt-1">
              ${(summary.total_income || 0).toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Expenses</p>
            <h4 className="text-lg font-bold text-rose-400 mt-1">
              ${(summary.total_expense || 0).toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Net Savings</p>
            <h4 className="text-lg font-bold text-indigo-400 mt-1">
              ${(summary.net_savings || 0).toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Savings Rate</p>
            <h4 className="text-lg font-bold text-cyan-400 mt-1">
              {(summary.savings_rate || 0).toFixed(1)}%
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickReportsView;
