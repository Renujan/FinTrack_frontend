import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Analytics & Financial Insights"
        subtitle="Analyze monthly spending trends, category breakdowns, and historical performance."
      />

      <Card>
        <EmptyState
          icon={<BarChart3 className="w-8 h-8" />}
          title="Analytics Architecture Ready"
          description="Analytics endpoints, breakdown models, and trend calculation services are configured and ready for chart visualizer integration."
        />
      </Card>
    </div>
  );
};

export default AnalyticsPage;
