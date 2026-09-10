import React, { createContext, useCallback, useEffect, useState } from 'react';
import authService from '../services/authService';
import { LoginCredentials, RegisterCredentials, UserProfile } from '../types/user';
import tokenStorage from '../utils/tokenStorage';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      if (tokenStorage.hasAccessToken()) {
        const profile = await authService.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      tokenStorage.clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (tokenStorage.hasAccessToken()) {
        await refreshProfile();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshProfile]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const tokens = await authService.login(credentials);
      tokenStorage.setTokens(tokens.access, tokens.refresh);
      await refreshProfile();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.detail ||
                      (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.message ||
                      'Invalid username or password';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(credentials);
      // Auto-login upon successful registration if password is provided
      if (credentials.password) {
        await login({ username: credentials.username, password: credentials.password });
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.detail ||
                      'Registration failed. Please check your details.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Suppress logout API failures and clear state locally
      }
    }
    tokenStorage.clearTokens();
    setUser(null);
    setIsLoading(false);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
