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
  ShieldAlert,
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
        return <Badge variant="danger" size="sm">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="info" size="sm">MEDIUM</Badge>;
      default:
        return <Badge variant="secondary" size="sm">LOW</Badge>;
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
    return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
  };

  return (
    <div
      className={`relative p-4 rounded-2xl border transition-all duration-200 overflow-hidden ${
        notification.is_read
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75 hover:opacity-100'
          : 'bg-slate-900/90 border-slate-700/80 shadow-lg ring-1 ring-emerald-500/20'
      }`}
    >
      {!notification.is_read && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 shadow-glow" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            {getTypeIcon(notification.notification_type)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4
                className={`text-sm font-bold ${
                  notification.is_read ? 'text-slate-300' : 'text-slate-100'
                }`}
              >
                {notification.title}
              </h4>
              {!notification.is_read && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  NEW
                </span>
              )}
              {getPriorityBadge(notification.priority)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
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
