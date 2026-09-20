export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PRO' | 'ENTERPRISE';

export interface SubscriptionPlan {
  code: SubscriptionTier;
  name: string;
  price: string;
  transaction_limit: number;
  budget_limit: number;
  goal_limit: number;
  features: string[];
}

export interface UserSubscriptionDetails {
  plan_code: SubscriptionTier;
  plan_name: string;
  status: string;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
}

export interface QuotaUsage {
  transactions: {
    used: number;
    limit: number;
    percentage: number;
  };
  budgets: {
    used: number;
    limit: number;
    percentage: number;
  };
  goals: {
    used: number;
    limit: number;
    percentage: number;
  };
}
