import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { PaginatedResponse } from '../types/common';
import { Category } from '../types/transaction';

export const categoryService = {
  getCategories: async (search?: string): Promise<Category[]> => {
    const response = await apiClient.get<PaginatedResponse<Category> | Category[]>(ENDPOINTS.CATEGORIES.LIST_CREATE, {
      params: { search, page_size: 100 },
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || [];
  },

  getCategoryById: async (id: number | string): Promise<Category> => {
    const response = await apiClient.get<Category>(ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post<Category>(ENDPOINTS.CATEGORIES.LIST_CREATE, data);
    return response.data;
  },

  updateCategory: async (id: number | string, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.patch<Category>(ENDPOINTS.CATEGORIES.DETAIL(id), data);
    return response.data;
  },

  deleteCategory: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CATEGORIES.DETAIL(id));
  },
};

export default categoryService;
