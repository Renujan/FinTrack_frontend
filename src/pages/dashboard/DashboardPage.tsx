import React, { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import FinancialSummaryCards from '../../components/dashboard/FinancialSummaryCards';
import IncomeExpenseOverview from '../../components/dashboard/IncomeExpenseOverview';
import BalanceSavingsOverview from '../../components/dashboard/BalanceSavingsOverview';
import RecentTransactionsWidget from '../../components/dashboard/RecentTransactionsWidget';
import BudgetOverviewWidget from '../../components/dashboard/BudgetOverviewWidget';
import GoalsOverviewWidget from '../../components/dashboard/GoalsOverviewWidget';
import SpendingAnalyticsWidget from '../../components/dashboard/SpendingAnalyticsWidget';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import DashboardErrorState from '../../components/dashboard/DashboardErrorState';
import dashboardService from '../../services/dashboardService';
import { DashboardData } from '../../types/dashboard';
import { parseApiError } from '../../utils/errorHandler';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [periodFilter, setPeriodFilter] = useState<'month' | 'all'>('month');

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      let params: { start_date?: string; end_date?: string } = {};

      if (periodFilter === 'month') {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        params.start_date = startOfMonth.toISOString().split('T')[0];
        params.end_date = now.toISOString().split('T')[0];
      }

      const result = await dashboardService.getDashboardOverview(params);
      setData(result);
    } catch (err: unknown) {
      const parsedErr = parseApiError(err);
      setError(parsedErr.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [periodFilter]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handlePeriodChange = (filter: 'month' | 'all') => {
    setPeriodFilter(filter);
  };

  return (
    <div className="space-y-6">
      {/* Header section with greetings & date filter */}
      <DashboardHeader
        onRefresh={() => fetchDashboardData(true)}
        isRefreshing={isRefreshing}
        periodFilter={periodFilter}
        onPeriodChange={handlePeriodChange}
      />

      {/* Main Content Render */}
      {loading ? (
        <DashboardSkeleton />
      ) : error && !data ? (
        <DashboardErrorState message={error} onRetry={() => fetchDashboardData()} />
      ) : (
        <div className="space-y-6">
          {/* Active Alerts Banner if present */}
          {data?.alerts && data.alerts.length > 0 && (
            <div className="space-y-2">
              {data.alerts.slice(0, 2).map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    alert.severity === 'error' || alert.severity === 'danger'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {alert.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    ) : alert.severity === 'error' ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 shrink-0" />
                    )}
                    <span>{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Summary Cards */}
          <FinancialSummaryCards
            summary={data?.financial_summary}
            overview={data?.income_expense_overview}
          />

          {/* Income vs Expenses Overview & Balance Savings Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IncomeExpenseOverview
                overview={data?.income_expense_overview}
                cashFlow={data?.cash_flow_summary}
              />
            </div>
            <div>
              <BalanceSavingsOverview
                balanceSummary={data?.balance_summary}
                summary={data?.financial_summary}
              />
            </div>
          </div>

          {/* Recent Transactions & Budget Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentTransactionsWidget transactions={data?.recent_transactions} />
            </div>
            <div>
              <BudgetOverviewWidget budgetOverview={data?.budget_overview} />
            </div>
          </div>

          {/* Goals & Spending Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalsOverviewWidget goalOverview={data?.goal_overview} />
            <SpendingAnalyticsWidget
              topCategories={data?.top_categories}
              insights={data?.spending_insights}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
