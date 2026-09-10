import React from 'react';
import { Outlet } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold mb-3 shadow-xl shadow-emerald-500/20">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight">
          Fin<span className="text-emerald-400">Track</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">SaaS Financial Tracker & Management System</p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-400 relative z-10">
        <p>&copy; {new Date().getFullYear()} FinTrack. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
