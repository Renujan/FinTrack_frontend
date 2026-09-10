import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { RecurringTransaction } from '../types/recurring';

export const recurringService = {
  getRecurringTransactions: async (): Promise<RecurringTransaction[]> => {
    const response = await apiClient.get<RecurringTransaction[]>(ENDPOINTS.RECURRING.LIST_CREATE);
    return response.data;
  },

  getRecurringById: async (id: number | string): Promise<RecurringTransaction> => {
    const response = await apiClient.get<RecurringTransaction>(ENDPOINTS.RECURRING.DETAIL(id));
    return response.data;
  },

  createRecurring: async (data: Partial<RecurringTransaction>): Promise<RecurringTransaction> => {
    const response = await apiClient.post<RecurringTransaction>(ENDPOINTS.RECURRING.LIST_CREATE, data);
    return response.data;
  },

  updateRecurring: async (id: number | string, data: Partial<RecurringTransaction>): Promise<RecurringTransaction> => {
    const response = await apiClient.patch<RecurringTransaction>(ENDPOINTS.RECURRING.DETAIL(id), data);
    return response.data;
  },

  deleteRecurring: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.RECURRING.DETAIL(id));
  },

  pauseRecurring: async (id: number | string): Promise<RecurringTransaction> => {
    const response = await apiClient.post<RecurringTransaction>(ENDPOINTS.RECURRING.PAUSE(id));
    return response.data;
  },

  resumeRecurring: async (id: number | string): Promise<RecurringTransaction> => {
    const response = await apiClient.post<RecurringTransaction>(ENDPOINTS.RECURRING.RESUME(id));
    return response.data;
  },
};

export default recurringService;
