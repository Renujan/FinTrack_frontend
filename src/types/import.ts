export type ImportStatus = 'PREVIEW_READY' | 'COMPLETED' | 'FAILED';

export interface ImportPreviewRow {
  row: number;
  title: string;
  description?: string;
  amount: string;
  transaction_type: string;
  category?: string;
  date: string;
  is_valid: boolean;
  is_duplicate: boolean;
  errors: string[];
}

export interface ImportPreviewResponse {
  id: number;
  file_name: string;
  status: ImportStatus;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  duplicate_rows: number;
  unmatched_categories: string[];
  errors: Array<{ row: number; field: string; message: string }>;
  preview_rows: ImportPreviewRow[];
}

export interface ImportExecutionResponse {
  id: number;
  file_name: string;
  status: ImportStatus;
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  skipped_rows: number;
  duplicate_rows: number;
  created_at: string;
  completed_at: string;
}
