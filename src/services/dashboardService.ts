import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  DashboardData,
  RecentTransactionItem,
  BudgetOverview,
  GoalOverview,
  DashboardFinancialSummary,
  SpendingInsights,
  DashboardAlertItem,
} from '../types/dashboard';

export interface DashboardParams {
  start_date?: string;
  end_date?: string;
  limit?: number;
  top_categories_limit?: number;
}

export const dashboardService = {
  /**
   * Fetch complete aggregated financial dashboard overview payload
   */
  async getDashboardOverview(params?: DashboardParams): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>(ENDPOINTS.DASHBOARD.OVERVIEW, { params });
    return response.data;
  },

  /**
   * Fetch core financial summary metrics
   */
  async getSummary(params?: DashboardParams): Promise<{
    financial_summary: DashboardFinancialSummary;
    income_expense_overview: any;
    balance_summary: any;
  }> {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.SUMMARY, { params });
    return response.data;
  },

  /**
   * Fetch user's recent transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<RecentTransactionItem[]> {
    const response = await apiClient.get<RecentTransactionItem[]>(
      ENDPOINTS.DASHBOARD.RECENT_TRANSACTIONS,
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * Fetch budget status overview
   */
  async getBudgetOverview(): Promise<BudgetOverview> {
    const response = await apiClient.get<BudgetOverview>(ENDPOINTS.DASHBOARD.BUDGETS);
    return response.data;
  },

  /**
   * Fetch financial goals overview
   */
  async getGoalOverview(): Promise<GoalOverview> {
    const response = await apiClient.get<GoalOverview>(ENDPOINTS.DASHBOARD.GOALS);
    return response.data;
  },

  /**
   * Fetch spending insights and top categories
   */
  async getSpendingInsights(params?: DashboardParams): Promise<{
    spending_insights: SpendingInsights;
    top_categories: any[];
  }> {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.INSIGHTS, { params });
    return response.data;
  },

  /**
   * Fetch active financial alerts
   */
  async getAlerts(): Promise<DashboardAlertItem[]> {
    const response = await apiClient.get<DashboardAlertItem[]>(ENDPOINTS.DASHBOARD.ALERTS);
    return response.data;
  },
};

export default dashboardService;
