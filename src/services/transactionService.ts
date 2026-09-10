import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { PaginatedResponse } from '../types/common';
import { Transaction, TransactionFilters } from '../types/transaction';

export const transactionService = {
  getTransactions: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(ENDPOINTS.TRANSACTIONS.LIST_CREATE, {
      params: filters,
    });
    return response.data;
  },

  getTransactionById: async (id: number | string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(ENDPOINTS.TRANSACTIONS.DETAIL(id));
    return response.data;
  },

  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(ENDPOINTS.TRANSACTIONS.LIST_CREATE, data);
    return response.data;
  },

  updateTransaction: async (id: number | string, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.patch<Transaction>(ENDPOINTS.TRANSACTIONS.DETAIL(id), data);
    return response.data;
  },

  deleteTransaction: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.TRANSACTIONS.DETAIL(id));
  },
};

export default transactionService;
