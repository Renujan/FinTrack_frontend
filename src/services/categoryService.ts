import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { Category } from '../types/transaction';

export const categoryService = {
  getCategories: async (search?: string): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.LIST_CREATE, {
      params: { search },
    });
    return response.data;
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
