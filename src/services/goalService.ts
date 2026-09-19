import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  Goal,
  GoalContribution,
  GoalProgressForecast,
  GoalSummary,
} from '../types/goal';

export interface GoalFilters {
  search?: string;
  status?: string;
  goal_type?: string;
  priority?: string;
  ordering?: string;
}

export const goalService = {
  getGoals: async (filters?: GoalFilters): Promise<Goal[]> => {
    const params: Record<string, any> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
    if (filters?.goal_type && filters.goal_type !== 'ALL') params.goal_type = filters.goal_type;
    if (filters?.priority && filters.priority !== 'ALL') params.priority = filters.priority;
    if (filters?.ordering) params.ordering = filters.ordering;

    const response = await apiClient.get<Goal[] | { results: Goal[] }>(
      ENDPOINTS.GOALS.LIST_CREATE,
      { params }
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },

  getGoalSummary: async (): Promise<GoalSummary> => {
    const response = await apiClient.get<GoalSummary>(ENDPOINTS.GOALS.SUMMARY);
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

  completeGoal: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.COMPLETE(id));
    return response.data;
  },

  pauseGoal: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.PAUSE(id));
    return response.data;
  },

  resumeGoal: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.RESUME(id));
    return response.data;
  },

  cancelGoal: async (id: number | string): Promise<Goal> => {
    const response = await apiClient.post<Goal>(ENDPOINTS.GOALS.CANCEL(id));
    return response.data;
  },

  getGoalProgress: async (id: number | string): Promise<GoalProgressForecast> => {
    const response = await apiClient.get<GoalProgressForecast>(ENDPOINTS.GOALS.PROGRESS(id));
    return response.data;
  },

  getContributions: async (id: number | string): Promise<GoalContribution[]> => {
    const response = await apiClient.get<GoalContribution[]>(
      ENDPOINTS.GOALS.CONTRIBUTIONS(id)
    );
    return response.data;
  },

  addContribution: async (
    id: number | string,
    data: { amount: number | string; note?: string; contribution_date?: string }
  ): Promise<GoalContribution> => {
    const response = await apiClient.post<GoalContribution>(
      ENDPOINTS.GOALS.CONTRIBUTIONS(id),
      data
    );
    return response.data;
  },

  deleteContribution: async (
    goalId: number | string,
    contributionId: number | string
  ): Promise<void> => {
    await apiClient.delete(
      ENDPOINTS.GOALS.CONTRIBUTION_DETAIL(goalId, contributionId)
    );
  },
};

export default goalService;
