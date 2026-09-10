import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/common/EmptyState';
import { Target, Plus } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Financial Goals & Savings"
        subtitle="Set savings targets, track progress milestones, and manage pause/resume goals."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Goal
          </Button>
        }
      />

      <Card>
        <EmptyState
          icon={<Target className="w-8 h-8" />}
          title="Financial Goals Module Initialized"
          description="Savings target calculation, deadline tracking, and pause/resume mechanisms are structured."
          actionLabel="Create Goal"
          onAction={() => alert('Goal creation modal will open here.')}
        />
      </Card>
    </div>
  );
};

export default GoalsPage;
