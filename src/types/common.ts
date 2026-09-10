/**
 * Common & Generic API Response Data Models
 */

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  created_at: string;
}
