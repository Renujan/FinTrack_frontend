import React, { createContext, useCallback, useEffect, useState } from 'react';
import authService from '../services/authService';
import { FormFieldErrors, LoginCredentials, RegisterCredentials, UserProfile } from '../types/user';
import parseApiError from '../utils/errorHandler';
import tokenStorage from '../utils/tokenStorage';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fieldErrors: FormFieldErrors;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginDemo: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      if (tokenStorage.hasAccessToken()) {
        const profile = await authService.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch {
      tokenStorage.clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (tokenStorage.hasAccessToken()) {
        await refreshProfile();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshProfile]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      clearError();
      const tokens = await authService.login(credentials);
      tokenStorage.setTokens(tokens.access, tokens.refresh);
      await refreshProfile();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Invalid username or password.');
      setError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    try {
      setIsLoading(true);
      clearError();
      const tokens = await authService.loginDemo();
      tokenStorage.setTokens(tokens.access, tokens.refresh);
      await refreshProfile();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to launch demo session.');
      setError(parsed.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    let autoLoggedIn = false;
    try {
      setIsLoading(true);
      clearError();
      await authService.register(credentials);
      
      // Attempt auto-login after registration
      if (credentials.username && credentials.password) {
        try {
          const tokens = await authService.login({
            username: credentials.username,
            password: credentials.password,
          });
          tokenStorage.setTokens(tokens.access, tokens.refresh);
          await refreshProfile();
          autoLoggedIn = true;
        } catch {
          // If auto-login fails, user can still log in manually on /login
          autoLoggedIn = false;
        }
      }
      return autoLoggedIn;
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Registration failed. Please check your details.');
      setError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
      throw err;
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
        // Suppress API errors on logout to ensure local cleanup always succeeds
      }
    }
    tokenStorage.clearTokens();
    setUser(null);
    clearError();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        fieldErrors,
        login,
        loginDemo,
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
