import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto backdrop-blur-md">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>FinTrack Pro Platform &copy; {new Date().getFullYear()} — Secure Financial Cloud</span>
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <a href="/landing#features" className="hover:text-emerald-400 transition">Features</a>
        <span>&bull;</span>
        <a href="/landing#pricing" className="hover:text-emerald-400 transition">Pricing</a>
        <span>&bull;</span>
        <a href="/landing#faq" className="hover:text-emerald-400 transition">Support</a>
      </div>
    </footer>
  );
};

export default Footer;
