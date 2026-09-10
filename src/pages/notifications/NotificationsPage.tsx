import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';
import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Notifications Center"
        subtitle="Manage budget breach alerts, goal milestones, and recurring schedule updates."
      />

      <Card>
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="Notification Center Initialized"
          description="System notifications, unread badges, and mark-all-read API integrations are prepared."
        />
      </Card>
    </div>
  );
};

export default NotificationsPage;
