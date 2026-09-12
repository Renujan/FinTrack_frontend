/**
 * Financial Dashboard Data Models
 */

export interface DashboardFinancialSummary {
  total_income: string;
  total_expenses: string;
  current_balance: string;
  net_cash_flow: string;
}

export interface PeriodDetail {
  start_date: string;
  end_date: string;
  income: string;
  expenses: string;
}

export interface IncomeExpenseOverview {
  period_type: string;
  current_period: PeriodDetail;
  previous_period: PeriodDetail;
  income_percentage_change: string;
  expense_percentage_change: string;
}

export interface BalanceSummary {
  total_income: string;
  total_expenses: string;
  current_balance: string;
  transaction_count: number;
  income_transaction_count: number;
  expense_transaction_count: number;
  balance_type: string;
  note: string;
}

export interface CashFlowSummaryItem {
  period: string;
  income: string;
  expenses: string;
  net_cash_flow: string;
  transaction_count: number;
}

export interface CategoryMin {
  id: number;
  name: string;
}

export interface RecentTransactionItem {
  id: number;
  title: string;
  description: string;
  amount: string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: CategoryMin | null;
  category_name: string;
  date: string;
}

export interface BudgetSummaryItem {
  id: number;
  name: string;
  category_name: string | null;
  is_overall: boolean;
  budget_amount: string;
  spent_amount: string;
  remaining_amount: string;
  percentage_used: number;
  is_exceeded: boolean;
  is_near_limit: boolean;
}

export interface BudgetOverview {
  total_budgets: number;
  active_budgets: number;
  exceeded_budgets: number;
  budgets_near_limit: number;
  total_budget_amount: string;
  total_spent_amount: string;
  remaining_amount: string;
  overall_utilization_percentage: number;
  budgets_summary: BudgetSummaryItem[];
}

export interface GoalSummaryItem {
  id: number;
  name: string;
  category_name: string | null;
  target_amount: string;
  current_amount: string;
  remaining_amount: string;
  percentage_complete: number;
  status: string;
  is_completed: boolean;
  is_near_completion: boolean;
  target_date: string;
  days_remaining: number;
}

export interface GoalOverview {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  near_completion_goals: number;
  total_target_amount: string;
  total_saved_amount: string;
  overall_progress_percentage: number;
  goals_summary: GoalSummaryItem[];
}

export interface TopCategoryItem {
  category: string;
  category_id: number | null;
  spent: string;
  percentage: number;
  transaction_count: number;
}

export interface LargestExpenseItem {
  id: number;
  title: string;
  description: string;
  amount: string;
  category_name: string;
  date: string;
}

export interface SpendingInsights {
  highest_spending_category: TopCategoryItem | null;
  largest_recent_expense: LargestExpenseItem | null;
  average_expense: string;
  spending_change_percentage: string;
  expense_transaction_count: number;
  total_expenses_amount: string;
}

export interface MonthlyComparison {
  current_month: string;
  previous_month: string;
  current_income: string;
  previous_income: string;
  income_difference: string;
  income_percentage_change: string;
  current_expenses: string;
  previous_expenses: string;
  expense_difference: string;
  expense_percentage_change: string;
  current_balance: string;
  previous_balance: string;
  balance_difference: string;
  balance_percentage_change: string;
}

export interface DashboardAlertItem {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success' | string;
  category: string;
  metadata?: Record<string, any>;
}

export interface DashboardData {
  financial_summary: DashboardFinancialSummary;
  income_expense_overview: IncomeExpenseOverview;
  balance_summary: BalanceSummary;
  cash_flow_summary: CashFlowSummaryItem[];
  recent_transactions: RecentTransactionItem[];
  budget_overview: BudgetOverview;
  goal_overview: GoalOverview;
  spending_insights: SpendingInsights;
  top_categories: TopCategoryItem[];
  monthly_comparison: MonthlyComparison;
  alerts: DashboardAlertItem[];
}
