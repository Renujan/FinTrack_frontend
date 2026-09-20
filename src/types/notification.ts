export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED';

export type NotificationType =
  | 'BUDGET_WARNING'
  | 'BUDGET_EXCEEDED'
  | 'GOAL_MILESTONE'
  | 'GOAL_COMPLETED'
  | 'GOAL_WARNING'
  | 'GOAL_NEAR_TARGET'
  | 'GOAL_OVERDUE'
  | 'RECURRING_TRANSACTION'
  | 'RECURRING_DUE'
  | 'RECURRING_GENERATED'
  | 'RECURRING_EXPIRED'
  | 'LARGE_EXPENSE'
  | 'INCOME_RECEIVED'
  | 'MONTHLY_SUMMARY'
  | 'SYSTEM_ALERT';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface NotificationSummary {
  unread_count: number;
  critical_count: number;
  total_count: number;
}
