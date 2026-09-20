import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import NotificationCard from '../../components/notifications/NotificationCard';
import NotificationSummaryHeader from '../../components/notifications/NotificationSummaryHeader';
import notificationService from '../../services/notificationService';
import { NotificationItem, NotificationSummary } from '../../types/notification';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, Trash2, RefreshCw } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchNotifications = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const [listData, summaryData] = await Promise.all([
        notificationService.getNotifications({ status: statusFilter }),
        notificationService.getSummary(),
      ]);
      setNotifications(listData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const handleMarkUnread = async (id: number) => {
    try {
      await notificationService.markAsUnread(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification unread', err);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await notificationService.archiveNotification(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to archive notification', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to clear all notifications', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        subtitle="Stay updated on budget breach alerts, goal milestones, and recurring schedule updates."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchNotifications(true)}
              isLoading={isRefreshing}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span>Mark All Read</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </Button>
          </div>
        }
      />

      {/* Summary Header Cards */}
      <NotificationSummaryHeader summary={summary} />

      {/* Filter tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {['ALL', 'UNREAD', 'READ', 'ARCHIVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === tab
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <LoadingSpinner size="lg" label="Loading notifications..." />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
          <EmptyState
            icon={<Bell className="w-8 h-8 text-slate-500" />}
            title="No Notifications Found"
            description="You are all caught up! No notifications match the selected filter."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <NotificationCard
              key={item.id}
              notification={item}
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkUnread}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
