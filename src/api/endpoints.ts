/**
 * Centralized API Endpoint Definitions
 */

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    REFRESH: '/auth/token/refresh/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
  },
  CATEGORIES: {
    LIST_CREATE: '/categories/',
    DETAIL: (id: number | string) => `/categories/${id}/`,
  },
  TRANSACTIONS: {
    LIST_CREATE: '/transactions/',
    DETAIL: (id: number | string) => `/transactions/${id}/`,
  },
  BUDGETS: {
    LIST_CREATE: '/budgets/',
    DETAIL: (id: number | string) => `/budgets/${id}/`,
  },
  GOALS: {
    LIST_CREATE: '/goals/',
    DETAIL: (id: number | string) => `/goals/${id}/`,
    PAUSE: (id: number | string) => `/goals/${id}/pause/`,
    RESUME: (id: number | string) => `/goals/${id}/resume/`,
  },
  RECURRING: {
    LIST_CREATE: '/recurring-transactions/',
    DETAIL: (id: number | string) => `/recurring-transactions/${id}/`,
    PAUSE: (id: number | string) => `/recurring-transactions/${id}/pause/`,
    RESUME: (id: number | string) => `/recurring-transactions/${id}/resume/`,
  },
  ANALYTICS: {
    SUMMARY: '/analytics/summary/',
    TRENDS: '/analytics/trends/',
    MONTHLY: '/analytics/monthly/',
    CATEGORIES: '/analytics/categories/',
    COMPARISON: '/analytics/comparison/',
    BUDGETS: '/analytics/budgets/',
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard/',
    SUMMARY: '/dashboard/summary/',
    RECENT_TRANSACTIONS: '/dashboard/recent-transactions/',
    BUDGETS: '/dashboard/budgets/',
    GOALS: '/dashboard/goals/',
    INSIGHTS: '/dashboard/insights/',
    ALERTS: '/dashboard/alerts/',
  },
  NOTIFICATIONS: {
    LIST: '/notifications/',
    MARK_READ: (id: number | string) => `/notifications/${id}/read/`,
    MARK_ALL_READ: '/notifications/mark-all-read/',
  },
};

export default ENDPOINTS;
