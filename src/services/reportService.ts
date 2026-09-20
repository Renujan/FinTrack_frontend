import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  FinancialReport,
  GenerateReportPayload,
  QuickReportSummary,
} from '../types/report';

export const reportService = {
  getReports: async (): Promise<FinancialReport[]> => {
    const response = await apiClient.get<FinancialReport[] | { results: FinancialReport[] }>(
      ENDPOINTS.REPORTS.LIST_CREATE
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },

  generateReport: async (payload: GenerateReportPayload): Promise<FinancialReport> => {
    const response = await apiClient.post<FinancialReport>(
      ENDPOINTS.REPORTS.LIST_CREATE,
      payload
    );
    return response.data;
  },

  deleteReport: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.REPORTS.DETAIL(id));
  },

  getDownloadUrl: (id: number | string): string => {
    const baseUrl = apiClient.defaults.baseURL || 'http://127.0.0.1:8000/api';
    return `${baseUrl}${ENDPOINTS.REPORTS.DOWNLOAD(id)}`;
  },

  getQuickSummary: async (startDate?: string, endDate?: string): Promise<QuickReportSummary> => {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await apiClient.get<QuickReportSummary>(
      ENDPOINTS.REPORTS.SUMMARY,
      { params }
    );
    return response.data;
  },
};

export default reportService;
