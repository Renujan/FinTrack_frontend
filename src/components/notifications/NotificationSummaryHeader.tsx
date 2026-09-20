import React from 'react';
import Card from '../ui/Card';
import { NotificationSummary } from '../../types/notification';
import { Bell, AlertOctagon, Layers } from 'lucide-react';

interface NotificationSummaryHeaderProps {
  summary: NotificationSummary | null;
}

export const NotificationSummaryHeader: React.FC<NotificationSummaryHeaderProps> = ({
  summary,
}) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Unread Alerts</p>
            <h4 className="text-lg font-bold text-emerald-400 mt-1">
              {summary.unread_count}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Critical Issues</p>
            <h4 className="text-lg font-bold text-rose-400 mt-1">
              {summary.critical_count}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Notifications</p>
            <h4 className="text-lg font-bold text-slate-200 mt-1">
              {summary.total_count}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSummaryHeader;
