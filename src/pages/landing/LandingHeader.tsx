import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Menu, X, Shield, Sparkles } from 'lucide-react';

interface LandingHeaderProps {
  onLoginClick?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                Fin<span className="text-emerald-400">Track</span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                  Pro
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#calculator"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1"
            >
              Interactive Demo
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              Reviews
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-200 hover:text-white px-4 py-2 rounded-xl transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold text-white rounded-xl group bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 group-hover:from-emerald-500 group-hover:to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-4 animate-slide-down backdrop-blur-2xl">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/50"
          >
            Features
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/50"
          >
            Savings Calculator
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/50"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/50"
          >
            FAQ
          </a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full text-center py-2.5 font-medium text-slate-200 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="w-full text-center py-2.5 font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
