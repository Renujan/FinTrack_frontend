import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';
import { FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Financial Reports & Exports"
        subtitle="Export statements in CSV or PDF formats and generate period summary reports."
      />

      <Card>
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="Reports Module Foundation"
          description="Report generation, export helper utilities, and date range parameters are prepared for future development."
        />
      </Card>
    </div>
  );
};

export default ReportsPage;
