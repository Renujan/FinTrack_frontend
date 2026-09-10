import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { Budget } from '../types/budget';

export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    const response = await apiClient.get<Budget[]>(ENDPOINTS.BUDGETS.LIST_CREATE);
    return response.data;
  },

  getBudgetById: async (id: number | string): Promise<Budget> => {
    const response = await apiClient.get<Budget>(ENDPOINTS.BUDGETS.DETAIL(id));
    return response.data;
  },

  createBudget: async (data: Partial<Budget>): Promise<Budget> => {
    const response = await apiClient.post<Budget>(ENDPOINTS.BUDGETS.LIST_CREATE, data);
    return response.data;
  },

  updateBudget: async (id: number | string, data: Partial<Budget>): Promise<Budget> => {
    const response = await apiClient.patch<Budget>(ENDPOINTS.BUDGETS.DETAIL(id), data);
    return response.data;
  },

  deleteBudget: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BUDGETS.DETAIL(id));
  },
};

export default budgetService;
