import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/common/EmptyState';
import { Repeat, Plus } from 'lucide-react';

export const RecurringPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Recurring Schedules"
        subtitle="Automate subscriptions, salaries, bills, and repeating income/expense cycles."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add Recurring Schedule
          </Button>
        }
      />

      <Card>
        <EmptyState
          icon={<Repeat className="w-8 h-8" />}
          title="Recurring Schedules Architecture Ready"
          description="Automated transaction processing, pause/resume schedule controls, and frequency handlers are ready for integration."
          actionLabel="Add Schedule"
          onAction={() => alert('Recurring schedule modal will open here.')}
        />
      </Card>
    </div>
  );
};

export default RecurringPage;
