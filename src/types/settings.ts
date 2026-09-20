export type ApplicationTheme = 'light' | 'dark' | 'system';

export interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  display_name?: string;
  bio?: string;
  phone_number?: string;
  currency?: string;
  created_at?: string;
}

export interface UserPreference {
  currency: string;
  date_format: string;
  timezone: string;
  language: string;
  theme: ApplicationTheme;
  default_transaction_type: 'EXPENSE' | 'INCOME';
  default_budget_period: 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  default_goal_priority: 'LOW' | 'MEDIUM' | 'HIGH';
  financial_year_start_month: number;
  email_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  financial_notifications_enabled: boolean;
  monthly_summary_enabled: boolean;
  budget_alerts: boolean;
  goal_alerts: boolean;
  recurring_transaction_alerts: boolean;
  large_expense_alerts_enabled: boolean;
  budget_warning_threshold: number;
  large_expense_threshold: number;
  recurring_reminder_days: number;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
