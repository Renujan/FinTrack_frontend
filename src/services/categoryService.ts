import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { PaginatedResponse } from '../types/common';
import { Category, CategoryFilters, CategoryFormData, CategoryStats } from '../types/category';
import { Transaction } from '../types/transaction';

export const categoryService = {
  /**
   * Fetch categories list with search, ordering, and pagination parameters
   */
  getCategories: async (filters?: CategoryFilters): Promise<PaginatedResponse<Category>> => {
    const cleanParams: Record<string, unknown> = { page_size: 100 };
    if (filters) {
      if (filters.search) cleanParams.search = filters.search;
      if (filters.ordering) cleanParams.ordering = filters.ordering;
      if (filters.page) cleanParams.page = filters.page;
      if (filters.page_size) cleanParams.page_size = filters.page_size;
    }

    const response = await apiClient.get<PaginatedResponse<Category> | Category[]>(
      ENDPOINTS.CATEGORIES.LIST_CREATE,
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
   * Get single category detail by ID
   */
  getCategoryById: async (id: number | string): Promise<Category> => {
    const response = await apiClient.get<Category>(ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data;
  },

  /**
   * Create new category
   */
  createCategory: async (data: CategoryFormData): Promise<Category> => {
    const response = await apiClient.post<Category>(ENDPOINTS.CATEGORIES.LIST_CREATE, data);
    return response.data;
  },

  /**
   * Update category by ID
   */
  updateCategory: async (id: number | string, data: CategoryFormData): Promise<Category> => {
    const response = await apiClient.patch<Category>(ENDPOINTS.CATEGORIES.DETAIL(id), data);
    return response.data;
  },

  /**
   * Delete category by ID
   */
  deleteCategory: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CATEGORIES.DETAIL(id));
  },

  /**
   * Aggregate transaction statistics per category using backend transaction records
   */
  getCategoryStatsMap: async (): Promise<Record<number, CategoryStats>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(ENDPOINTS.TRANSACTIONS.LIST_CREATE, {
        params: { page_size: 100 },
      });
      const transactions = response.data?.results || (Array.isArray(response.data) ? response.data : []);
      
      const statsMap: Record<number, CategoryStats> = {};

      transactions.forEach((tx) => {
        if (tx.category !== null && tx.category !== undefined) {
          const catId = typeof tx.category === 'object' ? (tx.category as unknown as Category).id : Number(tx.category);
          if (!statsMap[catId]) {
            statsMap[catId] = {
              id: catId,
              name: tx.category_name || '',
              transaction_count: 0,
              total_amount: 0,
            };
          }
          statsMap[catId].transaction_count += 1;
          const amt = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
          statsMap[catId].total_amount += isNaN(amt) ? 0 : amt;
        }
      });

      return statsMap;
    } catch {
      return {};
    }
  },
};

export default categoryService;
