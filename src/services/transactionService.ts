import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { PaginatedResponse } from '../types/common';
import { Transaction, TransactionFilters, TransactionFormData } from '../types/transaction';

export const transactionService = {
  getTransactions: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    const cleanParams: Record<string, unknown> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val;
        }
      });
    }

    const response = await apiClient.get<PaginatedResponse<Transaction>>(ENDPOINTS.TRANSACTIONS.LIST_CREATE, {
      params: cleanParams,
    });
    return response.data;
  },

  getTransactionById: async (id: number | string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(ENDPOINTS.TRANSACTIONS.DETAIL(id));
    return response.data;
  },

  createTransaction: async (data: TransactionFormData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(ENDPOINTS.TRANSACTIONS.LIST_CREATE, data);
    return response.data;
  },

  updateTransaction: async (id: number | string, data: Partial<TransactionFormData>): Promise<Transaction> => {
    const response = await apiClient.patch<Transaction>(ENDPOINTS.TRANSACTIONS.DETAIL(id), data);
    return response.data;
  },

  deleteTransaction: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.TRANSACTIONS.DETAIL(id));
  },
};

export default transactionService;

