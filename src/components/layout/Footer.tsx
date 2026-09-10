import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
      <div>
        <span>FinTrack SaaS Platform &copy; {new Date().getFullYear()} — Day 29 Frontend Architecture</span>
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <a href="#privacy" className="hover:text-slate-300 transition">Privacy</a>
        <span>&bull;</span>
        <a href="#terms" className="hover:text-slate-300 transition">Terms</a>
        <span>&bull;</span>
        <a href="#support" className="hover:text-slate-300 transition">API Support</a>
      </div>
    </footer>
  );
};

export default Footer;
