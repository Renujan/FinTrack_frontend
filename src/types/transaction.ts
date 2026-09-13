/**
 * Category & Transaction Data Models
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  user?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  category: number | null;
  category_name?: string;
  transaction_type: TransactionType;
  amount: number | string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionFilters {
  page?: number;
  page_size?: number;
  search?: string;
  type?: TransactionType;
  category?: string | number;
  date?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number | string;
  max_amount?: number | string;
  ordering?: string;
}

export interface TransactionFormData {
  category: number | string | null;
  transaction_type: TransactionType;
  amount: number | string;
  description: string;
  date: string;
}

