import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <LoadingSpinner size="lg" label="Verifying security session..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Landing Shortcut */}
      <Link
        to="/landing"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4 text-emerald-400" />
        <span>Back to Home</span>
      </Link>

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link to="/" className="inline-flex flex-col items-center group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight">
            Fin<span className="text-emerald-400">Track</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Next-Gen SaaS Personal Finance Intelligence</p>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-400 relative z-10">
        <p>&copy; {new Date().getFullYear()} FinTrack Inc. Bank-Grade 256-Bit SSL Encrypted.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
