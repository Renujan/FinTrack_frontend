import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/common/EmptyState';
import { ArrowLeftRight, Plus, Filter } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Transactions Management"
        subtitle="View, create, filter, and track all your income and expense records."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              Filter
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              New Transaction
            </Button>
          </div>
        }
      />

      <Card>
        <EmptyState
          icon={<ArrowLeftRight className="w-8 h-8" />}
          title="Transactions Module Initialized"
          description="The transaction management architecture is ready. Full transaction CRUD, categorization, date filtering, and receipt attachments will be implemented in upcoming frontend releases."
          actionLabel="Add First Transaction"
          onAction={() => alert('Transaction modal will open here.')}
        />
      </Card>
    </div>
  );
};

export default TransactionsPage;
