/**
 * User & Authentication Data Models
 */

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  currency?: string;
  date_joined?: string;
  is_active?: boolean;
}

export interface UserProfile extends User {
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  currency?: string;
}
