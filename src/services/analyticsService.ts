import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  AnalyticsSummary,
  CategoryAnalyticsItem,
  IncomeCategoryAnalyticsItem,
  IncomeExpenseAnalytics,
  TrendItem,
} from '../types/analytics';

export interface AnalyticsFilterParams {
  startDate?: string;
  endDate?: string;
  category?: string;
  transactionType?: string;
}

export const analyticsService = {
  getSummary: async (params?: AnalyticsFilterParams): Promise<AnalyticsSummary> => {
    const response = await apiClient.get<AnalyticsSummary>(ENDPOINTS.ANALYTICS.SUMMARY, {
      params: {
        start_date: params?.startDate,
        end_date: params?.endDate,
        category: params?.category,
        transaction_type: params?.transactionType,
      },
    });
    return response.data;
  },

  getIncomeExpenses: async (params?: AnalyticsFilterParams): Promise<IncomeExpenseAnalytics> => {
    const response = await apiClient.get<IncomeExpenseAnalytics>(
      ENDPOINTS.ANALYTICS.INCOME_EXPENSES,
      {
        params: {
          start_date: params?.startDate,
          end_date: params?.endDate,
        },
      }
    );
    return response.data;
  },

  getCategoryBreakdown: async (
    params?: AnalyticsFilterParams & { limit?: number }
  ): Promise<CategoryAnalyticsItem[]> => {
    const response = await apiClient.get<CategoryAnalyticsItem[]>(
      ENDPOINTS.ANALYTICS.CATEGORIES,
      {
        params: {
          start_date: params?.startDate,
          end_date: params?.endDate,
          category: params?.category,
          limit: params?.limit || 10,
        },
      }
    );
    return response.data;
  },

  getIncomeCategoryBreakdown: async (
    params?: AnalyticsFilterParams & { limit?: number }
  ): Promise<IncomeCategoryAnalyticsItem[]> => {
    const response = await apiClient.get<IncomeCategoryAnalyticsItem[]>(
      ENDPOINTS.ANALYTICS.INCOME_CATEGORIES,
      {
        params: {
          start_date: params?.startDate,
          end_date: params?.endDate,
          category: params?.category,
          limit: params?.limit || 10,
        },
      }
    );
    return response.data;
  },

  getTrends: async (
    groupBy: 'daily' | 'weekly' | 'monthly' = 'monthly',
    params?: AnalyticsFilterParams
  ): Promise<TrendItem[]> => {
    const response = await apiClient.get<TrendItem[]>(ENDPOINTS.ANALYTICS.TRENDS, {
      params: {
        group_by: groupBy,
        start_date: params?.startDate,
        end_date: params?.endDate,
        category: params?.category,
      },
    });
    return response.data;
  },
};

export default analyticsService;
