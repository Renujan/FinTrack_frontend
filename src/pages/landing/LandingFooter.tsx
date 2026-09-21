import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm relative z-10">
      {/* Top CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-slate-900">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Ready to Take Control of Your Money?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Join thousands of individuals tracking their net worth, managing budgets, and achieving financial freedom.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4">
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-sm hover:shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="font-heading font-bold text-xl text-white">
              Fin<span className="text-emerald-400">Track</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            FinTrack is a next-generation SaaS personal finance tracker designed to help you organize expenses, automate budget goals, and grow your net worth.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Bank-Grade 256-Bit SSL Secured
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 className="font-heading font-bold text-white text-sm mb-4">Product</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
            <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Savings Calculator</a></li>
            <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing Plans</a></li>
            <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Live App Demo</Link></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 className="font-heading font-bold text-white text-sm mb-4">Resources</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ & Support</a></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Create Account</Link></li>
          </ul>
        </div>

        {/* Links Col 3 */}
        <div>
          <h4 className="font-heading font-bold text-white text-sm mb-4">Stay Informed</h4>
          <p className="text-xs text-slate-400 mb-3">Subscribe for financial tips and feature updates.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} FinTrack Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for your financial success.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
