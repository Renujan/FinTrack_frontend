import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  ExportRecord,
  CreateExportPayload,
} from '../types/export';

export const exportService = {
  getExports: async (): Promise<ExportRecord[]> => {
    const response = await apiClient.get<ExportRecord[] | { results: ExportRecord[] }>(
      ENDPOINTS.EXPORTS.LIST_CREATE
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },

  createExport: async (payload: CreateExportPayload): Promise<ExportRecord> => {
    const response = await apiClient.post<ExportRecord>(
      ENDPOINTS.EXPORTS.LIST_CREATE,
      payload
    );
    return response.data;
  },

  deleteExport: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.EXPORTS.DETAIL(id));
  },

  getDownloadUrl: (id: number | string): string => {
    const baseUrl = apiClient.defaults.baseURL || 'http://127.0.0.1:8000/api';
    return `${baseUrl}${ENDPOINTS.EXPORTS.DOWNLOAD(id)}`;
  },
};

export default exportService;
