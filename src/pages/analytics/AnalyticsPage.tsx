import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  DateRangeSelector,
  AnalyticsSummaryCards,
  IncomeExpenseChart,
  SpendingByCategory,
  IncomeByCategory,
  SpendingTrend,
  PresetRange,
} from '../../components/analytics';
import {
  AnalyticsSummary,
  CategoryAnalyticsItem,
  IncomeCategoryAnalyticsItem,
  IncomeExpenseAnalytics,
  TrendItem,
} from '../../types/analytics';
import analyticsService from '../../services/analyticsService';
import useAuth from '../../hooks/useAuth';
import { BarChart3, RefreshCw } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  // Date Range State
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Granularity for trends
  const [trendGroup, setTrendGroup] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Analytics Data
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpenseAnalytics | null>(null);
  const [expenseCategories, setExpenseCategories] = useState<CategoryAnalyticsItem[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategoryAnalyticsItem[]>([]);
  const [trends, setTrends] = useState<TrendItem[]>([]);

  // Loading / Error
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const filterParams = { startDate, endDate };

        const [
          summaryRes,
          incExpRes,
          expCatRes,
          incCatRes,
          trendsRes,
        ] = await Promise.all([
          analyticsService.getSummary(filterParams).catch(() => null),
          analyticsService.getIncomeExpenses(filterParams).catch(() => null),
          analyticsService.getCategoryBreakdown({ ...filterParams, limit: 10 }).catch(() => []),
          analyticsService.getIncomeCategoryBreakdown({ ...filterParams, limit: 10 }).catch(() => []),
          analyticsService.getTrends(trendGroup, filterParams).catch(() => []),
        ]);

        setSummary(summaryRes);
        setIncomeExpenses(incExpRes);
        setExpenseCategories(expCatRes);
        setIncomeCategories(incCatRes);
        setTrends(trendsRes);
      } catch (err: any) {
        setError(err?.message || 'Failed to load financial analytics.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [startDate, endDate, trendGroup]
  );

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRangeChange = (start?: string, end?: string, preset?: PresetRange) => {
    setStartDate(start);
    setEndDate(end);
  };

  const hasData =
    summary &&
    (summary.total_income > 0 ||
      summary.total_expenses > 0 ||
      summary.transaction_count > 0 ||
      expenseCategories.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Analytics & Insights"
        subtitle="Analyze spending patterns, income vs expenses, category allocations, and historical trends."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchAnalyticsData(true)}
            isLoading={refreshing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        }
      />

      {/* Date Range Selector */}
      <DateRangeSelector onRangeChange={handleRangeChange} />

      {/* Main Analytics Content */}
      {loading ? (
        <Card>
          <div className="py-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-xs text-slate-400 mt-3">Fetching real-time analytics data...</p>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <ErrorMessage
            title="Failed to Load Analytics"
            message={error}
            onRetry={() => fetchAnalyticsData()}
          />
        </Card>
      ) : !hasData ? (
        <Card>
          <EmptyState
            icon={<BarChart3 className="w-8 h-8 text-slate-500" />}
            title="No analytics data available for this period."
            description="Try selecting a broader date range or record transactions to generate spending breakdown and financial performance graphs."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <AnalyticsSummaryCards summary={summary} currency={currency} />

          {/* Income vs Expenses Comparison Chart */}
          <IncomeExpenseChart data={incomeExpenses} currency={currency} />

          {/* Spending & Income Categories Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingByCategory categories={expenseCategories} currency={currency} />
            <IncomeByCategory categories={incomeCategories} currency={currency} />
          </div>

          {/* Spending & Income Trends Chart */}
          <SpendingTrend
            trends={trends}
            currency={currency}
            groupBy={trendGroup}
            onGroupByChange={setTrendGroup}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
