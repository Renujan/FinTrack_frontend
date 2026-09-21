import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  PieChart as PieIcon, 
  Zap,
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Dynamic Background Mesh & Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge Alert */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider animate-scale-up shadow-glow-emerald">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>Next-Gen Financial Intelligence 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-heading">
            Master Your Wealth.{' '}
            <span className="gradient-text">Automate Savings.</span>{' '}
            Track Every Cent.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Take complete control of your finances with real-time budget tracking, automated subscription detection, goal milestones, and AI-powered financial analytics.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-base hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span>Get Started Free — 14 Days</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 font-semibold text-base backdrop-blur-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Explore Live App</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encryption
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Rating (2,400+ reviews)
            </span>
          </div>
        </div>

        {/* Floating Mockup Preview Container */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Glass Glow Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-cyan-500/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition duration-1000" />

          {/* Dashboard Preview Frame */}
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-slide-up">
            {/* Window Controls Header */}
            <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> https://app.fintrack.io/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  LIVE DEMO
                </span>
              </div>
            </div>

            {/* Dashboard Mock Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-950/40">
              {/* Stat Card 1 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Net Worth Balance</p>
                  <h3 className="text-xl font-bold text-white font-heading">$48,250.00</h3>
                  <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +14.2% from last month
                  </span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <PieIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Monthly Savings Target</p>
                  <h3 className="text-xl font-bold text-white font-heading">$2,400 / $3,000</h3>
                  <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full w-[80%]" />
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Recurring Subscriptions</p>
                  <h3 className="text-xl font-bold text-white font-heading">6 Active</h3>
                  <span className="text-[11px] text-slate-400">Next renewal: Spotify ($9.99 in 3d)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
