export type ReportType =
  | 'MONTHLY'
  | 'YEARLY'
  | 'CUSTOM_RANGE'
  | 'SPENDING'
  | 'INCOME'
  | 'BUDGET'
  | 'GOALS'
  | 'FINANCIAL_SUMMARY';

export type ReportFormat = 'JSON' | 'CSV';

export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export interface FinancialReport {
  id: number;
  name: string;
  report_type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  file_name?: string;
  file_size?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  completed_at?: string;
  expires_at?: string;
  is_expired?: boolean;
  download_url?: string;
  summary_data?: Record<string, any>;
}

export interface GenerateReportPayload {
  name: string;
  report_type: ReportType;
  format: ReportFormat;
  start_date?: string;
  end_date?: string;
}

export interface QuickReportSummary {
  total_income: number;
  total_expense: number;
  net_savings: number;
  savings_rate: number;
  transaction_count: number;
  budget_count: number;
  goal_count: number;
}
