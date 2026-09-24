/**
 * Centralized API Endpoint Definitions
 */

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    DEMO: '/auth/demo/',
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
    SUMMARY: '/goals/summary/',
    CONTRIBUTIONS: (id: number | string) => `/goals/${id}/contributions/`,
    CONTRIBUTION_DETAIL: (goalId: number | string, id: number | string) =>
      `/goals/${goalId}/contributions/${id}/`,
    COMPLETE: (id: number | string) => `/goals/${id}/complete/`,
    PAUSE: (id: number | string) => `/goals/${id}/pause/`,
    RESUME: (id: number | string) => `/goals/${id}/resume/`,
    CANCEL: (id: number | string) => `/goals/${id}/cancel/`,
    PROGRESS: (id: number | string) => `/goals/${id}/progress/`,
  },
  RECURRING: {
    LIST_CREATE: '/recurring-transactions/',
    DETAIL: (id: number | string) => `/recurring-transactions/${id}/`,
    PAUSE: (id: number | string) => `/recurring-transactions/${id}/pause/`,
    RESUME: (id: number | string) => `/recurring-transactions/${id}/resume/`,
    EXECUTE: (id: number | string) => `/recurring-transactions/${id}/execute/`,
    HISTORY: (id: number | string) => `/recurring-transactions/${id}/history/`,
  },
  ANALYTICS: {
    SUMMARY: '/analytics/summary/',
    INCOME_EXPENSES: '/analytics/income-expenses/',
    CATEGORIES: '/analytics/categories/',
    INCOME_CATEGORIES: '/analytics/income-categories/',
    DAILY: '/analytics/daily/',
    MONTHLY: '/analytics/monthly/',
    TRENDS: '/analytics/trends/',
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
    DETAIL: (id: number | string) => `/notifications/${id}/`,
    READ: (id: number | string) => `/notifications/${id}/read/`,
    UNREAD: (id: number | string) => `/notifications/${id}/unread/`,
    ARCHIVE: (id: number | string) => `/notifications/${id}/archive/`,
    MARK_ALL_READ: '/notifications/mark-all-read/',
    CLEAR_ALL: '/notifications/clear-all/',
    SUMMARY: '/notifications/summary/',
  },
  REPORTS: {
    LIST_CREATE: '/reports/',
    DETAIL: (id: number | string) => `/reports/${id}/`,
    DOWNLOAD: (id: number | string) => `/reports/${id}/download/`,
    SUMMARY: '/reports/summary/',
    SPENDING: '/reports/spending/',
    INCOME: '/reports/income/',
    BUDGET: '/reports/budget/',
    GOALS: '/reports/goals/',
  },
  IMPORTS: {
    PREVIEW: '/imports/preview/',
    EXECUTE: (id: number | string) => `/imports/${id}/execute/`,
    LIST: '/imports/',
    DETAIL: (id: number | string) => `/imports/${id}/`,
  },
  EXPORTS: {
    LIST_CREATE: '/exports/',
    DETAIL: (id: number | string) => `/exports/${id}/`,
    DOWNLOAD: (id: number | string) => `/exports/${id}/download/`,
  },
  BACKUPS: {
    LIST_CREATE: '/backups/',
    DETAIL: (id: number | string) => `/backups/${id}/`,
    DOWNLOAD: (id: number | string) => `/backups/${id}/download/`,
    VALIDATE_RESTORE: '/backups/validate-restore/',
  },
  SUBSCRIPTION: {
    CURRENT: '/subscription/',
    USAGE: '/subscription/usage/',
    PLANS: '/subscription/plans/',
    UPGRADE: '/subscription/upgrade/',
    CANCEL: '/subscription/cancel/',
  },
  SETTINGS: {
    MAIN: '/settings/',
    NOTIFICATIONS: '/settings/notifications/',
    FINANCIAL: '/settings/financial/',
    RESET: '/settings/reset/',
    PROFILE: '/profile/',
    ACCOUNT_PREFERENCES: '/account/preferences/',
    CHANGE_PASSWORD: '/account/change-password/',
  },
  AUDIT_LOGS: {
    LIST: '/audit-logs/',
    DETAIL: (id: number | string) => `/audit-logs/${id}/`,
  },
};

export default ENDPOINTS;
