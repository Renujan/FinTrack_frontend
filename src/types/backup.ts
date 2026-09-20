export interface BackupRecord {
  id: number;
  name: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  backup_type: 'FULL' | 'TRANSACTIONS' | 'SELECTED';
  file_size?: number;
  record_count?: number;
  metadata?: {
    section_counts?: Record<string, number>;
    version?: string;
    retention_days?: number;
  };
  created_at: string;
  expires_at?: string;
  is_expired?: boolean;
  download_url?: string;
}

export interface CreateBackupPayload {
  name: string;
  backup_type: 'FULL' | 'TRANSACTIONS' | 'SELECTED';
  retention_days?: number;
}

export interface RestoreValidationResponse {
  valid: boolean;
  version: string;
  supported: boolean;
  backup_type: string;
  created_at: string;
  summary: {
    categories_count: number;
    transactions_count: number;
    budgets_count: number;
    financial_goals_count: number;
    recurring_transactions_count: number;
  };
  validation_errors: string[];
  validation_warnings: string[];
  note: string;
}
