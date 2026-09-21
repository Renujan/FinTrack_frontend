import React from 'react';
import { 
  PieChart, 
  Target, 
  RefreshCw, 
  Download, 
  BellRing, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Layers 
} from 'lucide-react';

const features = [
  {
    icon: PieChart,
    title: 'Smart Expense Analytics',
    description: 'Automatic transaction categorization and interactive visual charts break down income versus spending across custom categories.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    badge: 'Popular',
  },
  {
    icon: Target,
    title: 'Budget & Goal Milestones',
    description: 'Set custom monthly budget ceilings and savings goals. Watch progress bars advance in real time as contributions accumulate.',
    gradient: 'from-teal-500/20 to-cyan-500/10',
    iconColor: 'text-teal-400',
  },
  {
    icon: RefreshCw,
    title: 'Recurring Subscriptions',
    description: 'Never get surprised by auto-renewals. Track Netflix, Spotify, cloud storage, and gym memberships in one clean dashboard.',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Download,
    title: 'Instant Financial Reports',
    description: 'Generate polished monthly PDF summaries and raw CSV exports for tax season or accounting with a single click.',
    gradient: 'from-indigo-500/20 to-violet-500/10',
    iconColor: 'text-indigo-400',
  },
  {
    icon: BellRing,
    title: 'Real-Time Smart Alerts',
    description: 'Get instant notifications when approaching budget limits, recurring payment deadlines, or unusual spending spikes.',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'Your financial data is encrypted end-to-end with 256-bit AES encryption. We never sell your personal financial insights.',
    gradient: 'from-emerald-500/20 to-cyan-500/10',
    iconColor: 'text-emerald-400',
    badge: '256-Bit',
  },
];

export const LandingFeatures: React.FC = () => {
  return (
    <section id="features" className="py-24 relative z-10 bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Built for Modern Money Management</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Everything You Need to <span className="gradient-text">Grow Your Wealth</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            FinTrack combines powerful analytics, proactive budgeting tools, and seamless reporting into one unified platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-slate-900/70 border border-slate-800/90 p-7 hover:border-slate-700/90 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden"
              >
                {/* Background Accent Glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
                />

                {/* Badge if present */}
                {feature.badge && (
                  <span className="absolute top-5 right-5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {feature.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 shadow-inner ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
