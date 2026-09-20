import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  BackupRecord,
  CreateBackupPayload,
  RestoreValidationResponse,
} from '../types/backup';

export const backupService = {
  getBackups: async (): Promise<BackupRecord[]> => {
    const response = await apiClient.get<BackupRecord[] | { results: BackupRecord[] }>(
      ENDPOINTS.BACKUPS.LIST_CREATE
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },

  createBackup: async (payload: CreateBackupPayload): Promise<BackupRecord> => {
    const response = await apiClient.post<BackupRecord>(
      ENDPOINTS.BACKUPS.LIST_CREATE,
      payload
    );
    return response.data;
  },

  deleteBackup: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BACKUPS.DETAIL(id));
  },

  getDownloadUrl: (id: number | string): string => {
    const baseUrl = apiClient.defaults.baseURL || 'http://127.0.0.1:8000/api';
    return `${baseUrl}${ENDPOINTS.BACKUPS.DOWNLOAD(id)}`;
  },

  validateRestore: async (file: File): Promise<RestoreValidationResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<RestoreValidationResponse>(
      ENDPOINTS.BACKUPS.VALIDATE_RESTORE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default backupService;
