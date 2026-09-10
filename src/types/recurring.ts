/**
 * Recurring Transaction Data Models
 */

export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringTransaction {
  id: number;
  title: string;
  amount: number | string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: number;
  category_name?: string;
  frequency: RecurringFrequency;
  start_date: string;
  end_date?: string;
  next_run_date?: string;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
