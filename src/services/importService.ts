import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  ImportPreviewResponse,
  ImportExecutionResponse,
} from '../types/import';

export const importService = {
  uploadCsvPreview: async (file: File): Promise<ImportPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ImportPreviewResponse>(
      ENDPOINTS.IMPORTS.PREVIEW,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  executeImport: async (id: number | string): Promise<ImportExecutionResponse> => {
    const response = await apiClient.post<ImportExecutionResponse>(
      ENDPOINTS.IMPORTS.EXECUTE(id)
    );
    return response.data;
  },

  getImportHistory: async (): Promise<ImportExecutionResponse[]> => {
    const response = await apiClient.get<ImportExecutionResponse[] | { results: ImportExecutionResponse[] }>(
      ENDPOINTS.IMPORTS.LIST
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },
};

export default importService;
