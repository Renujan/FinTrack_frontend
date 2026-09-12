import React from 'react';
import PageHeader from '../common/PageHeader';
import Button from '../ui/Button';
import { RefreshCw, Calendar } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';

export interface DashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  periodFilter: 'month' | 'all';
  onPeriodChange: (filter: 'month' | 'all') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  isRefreshing,
  periodFilter,
  onPeriodChange,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.first_name || user?.username || 'Financial Manager';
  const currentDateFormatted = formatDate(new Date(), { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <PageHeader
      title={`${getGreeting()}, ${displayName} 👋`}
      subtitle={`Here's your financial overview for ${currentDateFormatted}.`}
      action={
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => onPeriodChange('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                periodFilter === 'month'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => onPeriodChange('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                periodFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Time
            </button>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              aria-label="Refresh dashboard metrics"
            >
              Refresh
            </Button>
          )}
        </div>
      }
    />
  );
};

export default DashboardHeader;
