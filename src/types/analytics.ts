/**
 * Analytics Data Models matching Backend API Contracts
 */

export interface AnalyticsSummary {
  total_income: number;
  total_expenses: number;
  net_balance: number;
  savings_rate: number;
  transaction_count: number;
  income_transaction_count?: number;
  expense_transaction_count?: number;
  avg_income_transaction?: number;
  avg_expense_transaction?: number;
}

export interface IncomeExpenseAnalytics {
  income: number;
  expenses: number;
  net: number;
  savings_rate: number;
  transaction_count: number;
  income_count?: number;
  expense_count?: number;
}

export interface CategoryAnalyticsItem {
  category: string;
  category_id: number | null;
  amount: number;
  spent?: number;
  percentage: number;
  percentage_of_total?: number;
  transaction_count: number;
}

export interface IncomeCategoryAnalyticsItem {
  category: string;
  category_id: number | null;
  amount: number;
  income?: number;
  percentage: number;
  percentage_of_total?: number;
  transaction_count: number;
}

export interface TrendItem {
  period: string;
  date?: string;
  month?: string;
  income: number;
  expenses: number;
  net: number;
  transaction_count?: number;
}

export interface PeriodMetric {
  start_date: string;
  end_date: string;
  income: number;
  expenses: number;
  net_balance: number;
  transaction_count: number;
}

export interface PeriodComparison {
  current_period: PeriodMetric;
  previous_period: PeriodMetric;
  income_change: number;
  expense_change: number;
  net_change: number;
}
