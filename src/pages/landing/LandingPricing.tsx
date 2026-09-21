import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPricing: React.FC = () => {
  const [annual, setAnnual] = useState<boolean>(true);

  const plans = [
    {
      name: 'Starter',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Perfect for individuals starting their financial tracking journey.',
      features: [
        'Up to 100 Transactions / Month',
        'Basic Category Management',
        '3 Active Financial Goals',
        'Standard Email Notifications',
        'CSV Export Support',
      ],
      ctaText: 'Get Started Free',
      ctaVariant: 'secondary',
      badge: null,
    },
    {
      name: 'Pro Trader',
      priceMonthly: 15,
      priceAnnual: 12,
      description: 'Ideal for professionals seeking automated budgets & detailed analytics.',
      features: [
        'Unlimited Transactions & History',
        'AI Automatic Categorization',
        'Unlimited Budgets & Goals',
        'Subscription Renewal Alerts',
        'PDF & CSV Export Reports',
        '256-Bit Encrypted Backups',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaVariant: 'primary',
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise / Family',
      priceMonthly: 35,
      priceAnnual: 29,
      description: 'For power users, multi-currency accounting, and shared family finances.',
      features: [
        'Everything in Pro Trader',
        'Multi-User Shared Dashboards',
        'Custom Category Rules & Tags',
        'Priority 24/7 Dedicated Support',
        'Automated Monthly Audits',
        'API Integration Access',
      ],
      ctaText: 'Contact Sales / Join',
      ctaVariant: 'secondary',
      badge: 'Power Users',
    },
  ];

  return (
    <section id="pricing" className="py-24 relative z-10 bg-slate-950/80 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Simple Plans for <span className="gradient-text">Every Financial Goal</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            No surprise fees. Upgrade or cancel anytime with one simple click.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-8 bg-slate-800 rounded-full p-1 transition-colors duration-200 focus:outline-none border border-slate-700"
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-md transform transition-transform duration-200 ${
                  annual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${annual ? 'text-white' : 'text-slate-400'}`}>
              Yearly Billing
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isPopular = plan.badge === 'Most Popular';
            const displayPrice = annual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-slate-900 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10 md:-translate-y-2'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <span
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-md ${
                      isPopular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white font-heading">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 min-h-[32px]">{plan.description}</p>

                  {/* Price */}
                  <div className="my-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-heading">
                      ${displayPrice}
                    </span>
                    <span className="text-slate-400 text-sm ml-1">/ month</span>
                    {annual && displayPrice > 0 && (
                      <p className="text-[11px] text-emerald-400 mt-1">Billed annually (${displayPrice * 12}/yr)</p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 pt-4 border-t border-slate-800">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-8 mt-auto">
                  <Link
                    to="/register"
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingPricing;
