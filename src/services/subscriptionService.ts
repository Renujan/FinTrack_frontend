import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';
import {
  UserSubscriptionDetails,
  SubscriptionPlan,
  QuotaUsage,
  SubscriptionTier,
} from '../types/subscription';

export const subscriptionService = {
  getCurrentSubscription: async (): Promise<UserSubscriptionDetails> => {
    const response = await apiClient.get<UserSubscriptionDetails>(ENDPOINTS.SUBSCRIPTION.CURRENT);
    return response.data;
  },

  getUsageQuotas: async (): Promise<QuotaUsage> => {
    const response = await apiClient.get<QuotaUsage>(ENDPOINTS.SUBSCRIPTION.USAGE);
    return response.data;
  },

  getAvailablePlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get<SubscriptionPlan[]>(ENDPOINTS.SUBSCRIPTION.PLANS);
    return response.data;
  },

  upgradePlan: async (planCode: SubscriptionTier): Promise<UserSubscriptionDetails> => {
    const response = await apiClient.post<UserSubscriptionDetails>(
      ENDPOINTS.SUBSCRIPTION.UPGRADE,
      { plan_code: planCode }
    );
    return response.data;
  },

  cancelSubscription: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(ENDPOINTS.SUBSCRIPTION.CANCEL);
    return response.data;
  },
};

export default subscriptionService;
