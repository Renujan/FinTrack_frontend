/**
 * Financial Goal Data Models
 */

export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export interface Goal {
  id: number;
  title: string;
  target_amount: number | string;
  current_amount: number | string;
  deadline?: string;
  status: GoalStatus;
  percentage_completed?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
