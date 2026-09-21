import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PieChart,
  Repeat,
  Target,
  BarChart3,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/categories', label: 'Categories', icon: Tags },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
  { path: '/recurring', label: 'Recurring', icon: Repeat },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-950/85 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold font-heading text-white tracking-tight flex items-center gap-1.5">
              Fin<span className="text-emerald-400">Track</span>
            </span>
          )}
        </NavLink>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition hidden md:flex"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/5 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border hover:border-slate-800/60'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Status Footer */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-xs text-slate-400 relative overflow-hidden">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> FinTrack SaaS
            </span>
            <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Cloud Sync & Security Active</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
