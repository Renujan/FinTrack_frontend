import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  NotificationItem,
  NotificationSummary,
} from '../types/notification';

export interface NotificationFilters {
  status?: string;
  priority?: string;
  notification_type?: string;
  search?: string;
}

export const notificationService = {
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationItem[]> => {
    const params: Record<string, any> = {};
    if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
    if (filters?.priority && filters.priority !== 'ALL') params.priority = filters.priority;
    if (filters?.notification_type && filters.notification_type !== 'ALL') {
      params.notification_type = filters.notification_type;
    }
    if (filters?.search) params.search = filters.search;

    const response = await apiClient.get<NotificationItem[] | { results: NotificationItem[] }>(
      ENDPOINTS.NOTIFICATIONS.LIST,
      { params }
    );

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray((response.data as any).results)) {
      return (response.data as any).results;
    }
    return [];
  },

  markAsRead: async (id: number | string): Promise<NotificationItem> => {
    const response = await apiClient.post<NotificationItem>(ENDPOINTS.NOTIFICATIONS.READ(id));
    return response.data;
  },

  markAsUnread: async (id: number | string): Promise<NotificationItem> => {
    const response = await apiClient.post<NotificationItem>(ENDPOINTS.NOTIFICATIONS.UNREAD(id));
    return response.data;
  },

  archiveNotification: async (id: number | string): Promise<NotificationItem> => {
    const response = await apiClient.post<NotificationItem>(ENDPOINTS.NOTIFICATIONS.ARCHIVE(id));
    return response.data;
  },

  deleteNotification: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.NOTIFICATIONS.DETAIL(id));
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    );
    return response.data;
  },

  clearAll: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      ENDPOINTS.NOTIFICATIONS.CLEAR_ALL
    );
    return response.data;
  },

  getSummary: async (): Promise<NotificationSummary> => {
    const response = await apiClient.get<NotificationSummary>(ENDPOINTS.NOTIFICATIONS.SUMMARY);
    return response.data;
  },
};

export default notificationService;
