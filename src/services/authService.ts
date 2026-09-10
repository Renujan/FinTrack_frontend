import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import { AuthTokens, LoginCredentials, RegisterCredentials, UserProfile } from '../types/user';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<UserProfile> => {
    const response = await apiClient.post<UserProfile>(ENDPOINTS.AUTH.REGISTER, credentials);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refresh: refreshToken });
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch<UserProfile>(ENDPOINTS.AUTH.PROFILE, data);
    return response.data;
  },
};

export default authService;
