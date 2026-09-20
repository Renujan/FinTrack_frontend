export type ExportType =
  | 'TRANSACTIONS'
  | 'CATEGORIES'
  | 'BUDGETS'
  | 'GOALS'
  | 'RECURRING_TRANSACTIONS'
  | 'FULL_FINANCIAL_DATA';

export type ExportFormat = 'CSV' | 'JSON';

export interface ExportRecord {
  id: number;
  name: string;
  export_type: ExportType;
  format: ExportFormat;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  file_name?: string;
  file_size?: number;
  record_count?: number;
  created_at: string;
  download_url?: string;
}

export interface CreateExportPayload {
  name: string;
  export_type: ExportType;
  format: ExportFormat;
  start_date?: string;
  end_date?: string;
  category?: number;
  transaction_type?: string;
}
