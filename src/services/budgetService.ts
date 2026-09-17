import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { Budget, BudgetFiltersParams, BudgetFormData, BudgetSummaryData } from '../types/budget';
import { PaginatedResponse } from '../types/common';

export const budgetService = {
  /**
   * Fetch budgets list with filtering, searching, ordering, and pagination
   */
  getBudgets: async (filters?: BudgetFiltersParams): Promise<PaginatedResponse<Budget>> => {
    const cleanParams: Record<string, unknown> = {};

    if (filters) {
      if (filters.search) cleanParams.search = filters.search;
      if (filters.category !== undefined && filters.category !== '' && filters.category !== null) {
        cleanParams.category = filters.category;
      }
      if (filters.period) cleanParams.period = filters.period;
      if (filters.start_date) cleanParams.start_date = filters.start_date;
      if (filters.end_date) cleanParams.end_date = filters.end_date;
      if (filters.is_overall !== undefined) cleanParams.is_overall = filters.is_overall;
      if (filters.is_exceeded !== undefined) cleanParams.is_exceeded = filters.is_exceeded;
      if (filters.ordering) cleanParams.ordering = filters.ordering;
      if (filters.page) cleanParams.page = filters.page;
      if (filters.page_size) cleanParams.page_size = filters.page_size;
    }

    const response = await apiClient.get<PaginatedResponse<Budget> | Budget[]>(
      ENDPOINTS.BUDGETS.LIST_CREATE,
      { params: cleanParams }
    );

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }

    return response.data || { count: 0, next: null, previous: null, results: [] };
  },

  /**
   * Get single budget by ID
   */
  getBudgetById: async (id: number | string): Promise<Budget> => {
    const response = await apiClient.get<Budget>(ENDPOINTS.BUDGETS.DETAIL(id));
    return response.data;
  },

  /**
   * Create new budget
   */
  createBudget: async (data: BudgetFormData): Promise<Budget> => {
    const payload: Record<string, unknown> = {
      name: data.name,
      amount: data.amount,
      period: data.period,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    if (data.category !== undefined && data.category !== null) {
      payload.category = data.category;
    } else {
      payload.category = null;
    }

    const response = await apiClient.post<Budget>(ENDPOINTS.BUDGETS.LIST_CREATE, payload);
    return response.data;
  },

  /**
   * Update existing budget
   */
  updateBudget: async (id: number | string, data: Partial<BudgetFormData>): Promise<Budget> => {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.amount !== undefined) payload.amount = data.amount;
    if (data.period !== undefined) payload.period = data.period;
    if (data.start_date !== undefined) payload.start_date = data.start_date;
    if (data.end_date !== undefined) payload.end_date = data.end_date;
    if (data.category !== undefined) payload.category = data.category;

    const response = await apiClient.patch<Budget>(ENDPOINTS.BUDGETS.DETAIL(id), payload);
    return response.data;
  },

  /**
   * Delete budget by ID
   */
  deleteBudget: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BUDGETS.DETAIL(id));
  },

  /**
   * Get aggregated budget summary metrics from dashboard/budgets backend endpoint
   */
  getBudgetSummary: async (): Promise<BudgetSummaryData> => {
    const response = await apiClient.get<BudgetSummaryData>(ENDPOINTS.DASHBOARD.BUDGETS);
    return response.data;
  },
};

export default budgetService;
