/**
 * Recurring Transaction Data Models & Query Interfaces
 */

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
export type ExecutionStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED';

export interface RecurringTransaction {
  id: number;
  name: string;
  title?: string;
  description?: string;
  amount: number | string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: number;
  category_name?: string;
  frequency: RecurrenceFrequency;
  interval: number;
  start_date: string;
  end_date?: string | null;
  next_run_date?: string;
  last_run_date?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RecurringTransactionExecution {
  id: number;
  recurring_transaction_id: number;
  recurring_transaction_name: string;
  transaction_id: number | null;
  executed_at: string;
  scheduled_for?: string | null;
  status: ExecutionStatus;
  error_message?: string;
}

export interface RecurringTransactionFilters {
  page?: number;
  page_size?: number;
  search?: string;
  type?: 'INCOME' | 'EXPENSE' | '';
  transaction_type?: 'INCOME' | 'EXPENSE' | '';
  category?: string | number;
  frequency?: string;
  is_active?: boolean | string;
  ordering?: string;
  start_date?: string;
  end_date?: string;
  next_run_date?: string;
}

export interface RecurringTransactionFormData {
  name: string;
  amount: number | string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: number | string;
  frequency: RecurrenceFrequency;
  interval: number;
  start_date: string;
  end_date?: string | null;
  next_run_date?: string;
  description?: string;
}

export interface RecurringExecuteResponse {
  detail: string;
  transaction?: unknown;
  recurring_transaction?: RecurringTransaction;
}
