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

export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  display_name?: string;
  bio?: string;
  phone_number?: string;
  currency?: string;
  profile_updated_at?: string;
  created_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  currency?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    currency: string;
  };
}

export interface FormFieldErrors {
  [key: string]: string;
}

