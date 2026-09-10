import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/common/EmptyState';
import { PieChart, Plus } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Budget Planning & Limits"
        subtitle="Set spending limits per category and track real-time utilization warnings."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Set New Budget
          </Button>
        }
      />

      <Card>
        <EmptyState
          icon={<PieChart className="w-8 h-8" />}
          title="Budgets Foundation Active"
          description="Category budget setup and threshold alert mechanisms are architected and ready for feature implementation."
          actionLabel="Create Budget"
          onAction={() => alert('Budget creation modal will open here.')}
        />
      </Card>
    </div>
  );
};

export default BudgetsPage;
