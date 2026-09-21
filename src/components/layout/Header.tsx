import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, User as UserIcon, Globe } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import notificationService from '../../services/notificationService';

export interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const summary = await notificationService.getSummary();
        setUnreadCount(summary.unread_count || 0);
      } catch (err) {
        // Silent fallback for notification summary
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions, budgets, goals..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Landing Page Shortcut */}
        <Link
          to="/landing"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          title="View Marketing Landing Page"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Landing Page</span>
        </Link>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 relative transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4 px-1 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center ring-2 ring-slate-950">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-800" />

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 hover:opacity-90 transition text-left"
            title="Account Settings"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-emerald-500/20 shadow-md">
              {user?.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-200 leading-tight font-heading">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.email || 'pro_user@fintrack.io'}</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
