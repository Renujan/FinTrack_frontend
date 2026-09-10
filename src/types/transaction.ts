/**
 * Category & Transaction Data Models
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  is_default?: boolean;
  user?: number | null;
  created_at?: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number | string;
  transaction_type: TransactionType;
  category: number | Category;
  category_name?: string;
  date: string;
  notes?: string;
  receipt_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionFilters {
  page?: number;
  page_size?: number;
  search?: string;
  category?: number;
  transaction_type?: TransactionType;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  ordering?: string;
}
