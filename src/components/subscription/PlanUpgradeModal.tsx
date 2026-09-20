import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import subscriptionService from '../../services/subscriptionService';
import { SubscriptionTier } from '../../types/subscription';
import { Zap, Check, Shield } from 'lucide-react';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: SubscriptionTier;
  onUpgraded: () => void;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan = 'FREE',
  onUpgraded,
}) => {
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);

  const plans = [
    {
      code: 'FREE' as SubscriptionTier,
      name: 'Free Tier',
      price: '$0 / mo',
      txLimit: '100 tx / mo',
      features: ['5 Category Budgets', '2 Savings Goals', 'Standard CSV Export'],
    },
    {
      code: 'PREMIUM' as SubscriptionTier,
      name: 'Premium',
      price: '$9.99 / mo',
      txLimit: '1,000 tx / mo',
      features: ['Unlimited Budgets', '15 Savings Goals', 'Recurring Automations', 'JSON & CSV Exports'],
    },
    {
      code: 'PRO' as SubscriptionTier,
      name: 'Pro Trader',
      price: '$19.99 / mo',
      txLimit: '10,000 tx / mo',
      features: ['Unlimited Everything', 'Automated JSON Backups', 'CSV Bulk Import Engine', 'Priority Support'],
    },
  ];

  const handleUpgrade = async (code: SubscriptionTier) => {
    setLoadingTier(code);
    try {
      await subscriptionService.upgradePlan(code);
      onUpgraded();
    } catch (err) {
      console.error('Failed to switch plan', err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Subscription Plan">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.code;
            return (
              <div
                key={p.code}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition ${
                  isCurrent
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100">{p.name}</h4>
                    {isCurrent && <Shield className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-lg font-extrabold text-emerald-400 mt-1">{p.price}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{p.txLimit}</p>

                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  {isCurrent ? (
                    <Button variant="ghost" size="sm" disabled className="w-full text-[11px]">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-[11px] flex items-center justify-center gap-1"
                      isLoading={loadingTier === p.code}
                      onClick={() => handleUpgrade(p.code)}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Switch to {p.name}</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlanUpgradeModal;
