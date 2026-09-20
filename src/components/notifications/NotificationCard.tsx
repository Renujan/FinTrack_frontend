import React from 'react';
import { NotificationItem } from '../../types/notification';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Info,
  Trash2,
  Eye,
  EyeOff,
  Archive,
} from 'lucide-react';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (id: number) => Promise<void>;
  onMarkUnread: (id: number) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDelete,
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="danger">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="warning">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="info">MEDIUM</Badge>;
      default:
        return <Badge variant="neutral">LOW</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('BUDGET') || type.includes('WARNING') || type.includes('OVERDUE')) {
      return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
    }
    if (type.includes('COMPLETED') || type.includes('MILESTONE')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
    if (type.includes('RECURRING') || type.includes('DUE')) {
      return <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
    if (type.includes('EXPENSE') || type.includes('INCOME')) {
      return <DollarSign className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
    return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        notification.is_read
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-slate-900/90 border-slate-700/80 shadow-lg ring-1 ring-emerald-500/10'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            {getTypeIcon(notification.notification_type)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-sm font-semibold ${
                  notification.is_read ? 'text-slate-300' : 'text-slate-100'
                }`}
              >
                {notification.title}
              </h4>
              {!notification.is_read && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              )}
              {getPriorityBadge(notification.priority)}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <Bell className="w-3 h-3 text-slate-600" />
              <span>{new Date(notification.created_at).toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1 shrink-0">
          {notification.is_read ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkUnread(notification.id)}
              title="Mark as Unread"
              className="p-1.5 text-slate-400 hover:text-slate-200"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(notification.id)}
              title="Mark as Read"
              className="p-1.5 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive(notification.id)}
            title="Archive"
            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10"
          >
            <Archive className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            title="Delete"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
