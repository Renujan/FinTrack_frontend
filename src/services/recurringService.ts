import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { PaginatedResponse } from '../types/common';
import {
  RecurringTransaction,
  RecurringTransactionExecution,
  RecurringTransactionFilters,
  RecurringTransactionFormData,
  RecurringExecuteResponse,
} from '../types/recurring';

export const recurringService = {
  /**
   * Fetch recurring transactions with filtering, search, ordering, and pagination
   */
  getRecurringTransactions: async (
    filters?: RecurringTransactionFilters
  ): Promise<PaginatedResponse<RecurringTransaction>> => {
    const params: Record<string, unknown> = {};
    if (filters) {
      if (filters.page) params.page = filters.page;
      if (filters.page_size) params.page_size = filters.page_size;
      if (filters.search && filters.search.trim()) params.search = filters.search.trim();
      const typeVal = filters.transaction_type || filters.type;
      if (typeVal) params.type = typeVal;
      if (filters.category) params.category = filters.category;
      if (filters.frequency) params.frequency = filters.frequency;
      if (filters.is_active !== undefined && filters.is_active !== '') {
        params.is_active = filters.is_active;
      }
      if (filters.ordering) params.ordering = filters.ordering;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.next_run_date) params.next_run_date = filters.next_run_date;
    }

    const response = await apiClient.get<PaginatedResponse<RecurringTransaction> | RecurringTransaction[]>(
      ENDPOINTS.RECURRING.LIST_CREATE,
      { params }
    );

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }
    return response.data;
  },

  /**
   * Retrieve a single recurring transaction by ID
   */
  getRecurringById: async (id: number | string): Promise<RecurringTransaction> => {
    const response = await apiClient.get<RecurringTransaction>(ENDPOINTS.RECURRING.DETAIL(id));
    return response.data;
  },

  /**
   * Create a new recurring transaction schedule
   */
  createRecurring: async (data: RecurringTransactionFormData): Promise<RecurringTransaction> => {
    const payload = {
      ...data,
      category: Number(data.category),
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
      interval: Number(data.interval || 1),
    };
    const response = await apiClient.post<RecurringTransaction>(ENDPOINTS.RECURRING.LIST_CREATE, payload);
    return response.data;
  },

  /**
   * Update an existing recurring transaction schedule
   */
  updateRecurring: async (
    id: number | string,
    data: Partial<RecurringTransactionFormData>
  ): Promise<RecurringTransaction> => {
    const payload: Record<string, unknown> = { ...data };
    if (data.category !== undefined) {
      payload.category = Number(data.category);
    }
    if (data.amount !== undefined) {
      payload.amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
    }
    if (data.interval !== undefined) {
      payload.interval = Number(data.interval);
    }

    const response = await apiClient.patch<RecurringTransaction>(ENDPOINTS.RECURRING.DETAIL(id), payload);
    return response.data;
  },

  /**
   * Delete a recurring transaction schedule
   */
  deleteRecurring: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.RECURRING.DETAIL(id));
  },

  /**
   * Pause an active recurring transaction schedule
   */
  pauseRecurring: async (id: number | string): Promise<RecurringTransaction> => {
    const response = await apiClient.post<RecurringTransaction>(ENDPOINTS.RECURRING.PAUSE(id));
    return response.data;
  },

  /**
   * Resume a paused recurring transaction schedule
   */
  resumeRecurring: async (id: number | string): Promise<RecurringTransaction> => {
    const response = await apiClient.post<RecurringTransaction>(ENDPOINTS.RECURRING.RESUME(id));
    return response.data;
  },

  /**
   * Manually trigger immediate execution of a recurring transaction
   */
  executeRecurring: async (id: number | string): Promise<RecurringExecuteResponse> => {
    const response = await apiClient.post<RecurringExecuteResponse>(ENDPOINTS.RECURRING.EXECUTE(id));
    return response.data;
  },

  /**
   * Retrieve execution history entries for a specific recurring schedule
   */
  getRecurringHistory: async (
    id: number | string
  ): Promise<PaginatedResponse<RecurringTransactionExecution>> => {
    const response = await apiClient.get<
      PaginatedResponse<RecurringTransactionExecution> | RecurringTransactionExecution[]
    >(ENDPOINTS.RECURRING.HISTORY(id));

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }
    return response.data;
  },
};

export default recurringService;
