import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { AnalyticsSummary, CategoryBreakdownItem, SpendTrendItem } from '../types/analytics';

export const analyticsService = {
  getSummary: async (startDate?: string, endDate?: string): Promise<AnalyticsSummary> => {
    const response = await apiClient.get<AnalyticsSummary>(ENDPOINTS.ANALYTICS.SUMMARY, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getTrends: async (groupBy = 'monthly', startDate?: string, endDate?: string): Promise<SpendTrendItem[]> => {
    const response = await apiClient.get<SpendTrendItem[]>(ENDPOINTS.ANALYTICS.TRENDS, {
      params: { group_by: groupBy, start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getCategoryBreakdown: async (limit = 5): Promise<CategoryBreakdownItem[]> => {
    const response = await apiClient.get<CategoryBreakdownItem[]>(ENDPOINTS.ANALYTICS.CATEGORIES, {
      params: { limit },
    });
    return response.data;
  },
};

export default analyticsService;
