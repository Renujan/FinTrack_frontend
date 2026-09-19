/**
 * Financial Goal Data Models
 */

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'PAUSED' | 'CANCELLED';
export type GoalType =
  | 'SAVINGS'
  | 'EMERGENCY_FUND'
  | 'PURCHASE'
  | 'TRAVEL'
  | 'INVESTMENT'
  | 'DEBT_REPAYMENT'
  | 'OTHER';
export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Goal {
  id: number;
  name: string;
  description?: string;
  category?: number | null;
  category_name?: string | null;
  target_amount: number | string;
  current_amount: number | string;
  remaining_amount?: number;
  progress_percentage?: number;
  required_monthly_saving?: number;
  target_date: string;
  goal_type?: GoalType;
  status?: GoalStatus;
  priority?: GoalPriority;
  is_active?: boolean;
  is_completed?: boolean;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GoalContribution {
  id: number;
  goal: number;
  goal_name?: string;
  amount: number | string;
  note?: string;
  contribution_date?: string;
  created_at?: string;
}

export interface GoalSummary {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  paused_goals: number;
  cancelled_goals: number;
  total_target_amount: number | string;
  total_saved_amount: number | string;
  total_remaining_amount: number | string;
  overall_progress_percentage: number;
}

export interface GoalProgressForecast {
  goal_id: number;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  remaining_amount: number;
  progress_percentage: number;
  days_remaining: number;
  required_monthly_saving: number;
  required_weekly_saving: number;
  required_daily_saving: number;
  projected_completion_date: string | null;
  status: string;
  priority: string;
  goal_type: string;
}
