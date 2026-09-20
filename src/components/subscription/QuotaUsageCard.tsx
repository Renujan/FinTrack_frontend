import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import subscriptionService from '../../services/subscriptionService';
import { QuotaUsage, UserSubscriptionDetails } from '../../types/subscription';
import Button from '../ui/Button';
import PlanUpgradeModal from './PlanUpgradeModal';
import { Zap, ShieldCheck } from 'lucide-react';

export const QuotaUsageCard: React.FC = () => {
  const [subscription, setSubscription] = useState<UserSubscriptionDetails | null>(null);
  const [usage, setUsage] = useState<QuotaUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const [sub, usg] = await Promise.all([
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getUsageQuotas(),
      ]);
      setSubscription(sub);
      setUsage(usg);
    } catch (err) {
      console.error('Failed to load subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  if (loading || !subscription) return null;

  return (
    <Card className="p-4 bg-slate-900/60 border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">
              {subscription.plan_name} Plan Tier
            </h4>
            <p className="text-[10px] text-slate-400">Account Quota Consumption</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsUpgradeOpen(true)}
          className="border-emerald-500/30 text-emerald-400 text-[11px] py-1 px-2.5 flex items-center gap-1"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Upgrade Tier</span>
        </Button>
      </div>

      {usage && (
        <div className="space-y-2 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Transactions: {usage.transactions.used} / {usage.transactions.limit}</span>
              <span>{usage.transactions.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${Math.min(usage.transactions.percentage, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Budgets: {usage.budgets.used} / {usage.budgets.limit}</span>
              <span>{usage.budgets.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all"
                style={{ width: `${Math.min(usage.budgets.percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <PlanUpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentPlan={subscription.plan_code}
        onUpgraded={() => {
          setIsUpgradeOpen(false);
          fetchSubscriptionData();
        }}
      />
    </Card>
  );
};

export default QuotaUsageCard;
