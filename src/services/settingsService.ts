import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  UserProfile,
  UserPreference,
  ChangePasswordPayload,
} from '../types/settings';

export const settingsService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(ENDPOINTS.SETTINGS.PROFILE);
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch<UserProfile>(ENDPOINTS.SETTINGS.PROFILE, data);
    return response.data;
  },

  getPreferences: async (): Promise<UserPreference> => {
    const response = await apiClient.get<UserPreference>(ENDPOINTS.SETTINGS.MAIN);
    return response.data;
  },

  updatePreferences: async (data: Partial<UserPreference>): Promise<UserPreference> => {
    const response = await apiClient.patch<UserPreference>(ENDPOINTS.SETTINGS.MAIN, data);
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      ENDPOINTS.SETTINGS.CHANGE_PASSWORD,
      payload
    );
    return response.data;
  },

  resetSettings: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(ENDPOINTS.SETTINGS.RESET);
    return response.data;
  },
};

export default settingsService;
