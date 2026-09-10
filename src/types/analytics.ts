/**
 * Analytics Data Models
 */

export interface AnalyticsSummary {
  total_income: number;
  total_expense: number;
  net_savings: number;
  savings_rate: number;
  transaction_count: number;
}

export interface SpendTrendItem {
  date: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdownItem {
  category_id: number;
  category_name: string;
  total_amount: number;
  percentage: number;
  color?: string;
}

export interface BudgetUtilizationSummary {
  total_budgets: number;
  over_budget_count: number;
  average_utilization: number;
}
