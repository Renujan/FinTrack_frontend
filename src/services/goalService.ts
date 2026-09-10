import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { Goal } from '../types/goal';

export const goalService = {
  getGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>(ENDPOINTS.GOALS.LIST_CREATE);
    return response.data;
  },

  getGoalById: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(ENDPOINTS.GOALS.DETAIL(id));
    return response.data;
  },

  createGoal: async (data: Partial<Goal>): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.LIST_CREATE, data);
    return response.data;
  },

  updateGoal: async (id: number | string, data: Partial<Goal>): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(ENDPOINTS.GOALS.DETAIL(id), data);
    return response.data;
  },

  deleteGoal: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.GOALS.DETAIL(id));
  },

  pauseGoal: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.PAUSE(id));
    return response.data;
  },

  resumeGoal: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.RESUME(id));
    return response.data;
  },
};

export default goalService;
