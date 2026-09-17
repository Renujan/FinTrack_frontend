/**
 * Budget Data Models matching DRF Budget backend contract
 */

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export interface Budget {
  id: number;
  name: string;
  category: number | null;
  category_name?: string | null;
  is_overall?: boolean;
  amount: number | string;
  budget_amount?: number | string;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  spent_amount?: number | string;
  remaining_amount?: number | string;
  percentage_used?: number;
  is_exceeded?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BudgetFormData {
  name: string;
  amount: number | string;
  period: BudgetPeriod;
  category?: number | null;
  start_date: string;
  end_date: string;
}

export interface BudgetFiltersParams {
  search?: string;
  category?: string | number;
  period?: BudgetPeriod | string;
  start_date?: string;
  end_date?: string;
  is_overall?: boolean;
  is_exceeded?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface BudgetSummaryData {
  total_budgets: number;
  active_budgets: number;
  exceeded_budgets: number;
  budgets_near_limit: number;
  total_budget_amount: string | number;
  total_spent_amount: string | number;
  remaining_amount: string | number;
  overall_utilization_percentage: number;
}
