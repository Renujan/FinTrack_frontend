/**
 * Budget Data Models
 */

export interface Budget {
  id: number;
  category: number;
  category_name?: string;
  amount: number | string;
  spent?: number | string;
  percentage_used?: number;
  start_date: string;
  end_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BudgetProgress extends Budget {
  remaining: number;
  is_exceeded: boolean;
}
