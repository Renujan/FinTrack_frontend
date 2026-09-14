/**
 * Category Model & Related Types
 */

export interface Category {
  id: number;
  name: string;
  user?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
}

export interface CategoryFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CategoryStats {
  id: number;
  name: string;
  transaction_count: number;
  total_amount: number;
}

export interface CategorySummaryMetrics {
  totalCategories: number;
  totalTransactionsLinked: number;
  filteredCount: number;
}
