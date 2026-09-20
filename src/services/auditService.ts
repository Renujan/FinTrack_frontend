import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { AuditLog } from '../types/audit';

export const auditService = {
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await apiClient.get<AuditLog[] | { results: AuditLog[] }>(
      ENDPOINTS.AUDIT_LOGS.LIST
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },
};

export default auditService;
