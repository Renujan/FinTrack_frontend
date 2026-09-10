import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/common/EmptyState';
import { Tags, Plus } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Category Management"
        subtitle="Organize income sources and spending categories with custom colors and icons."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create Category
          </Button>
        }
      />

      <Card>
        <EmptyState
          icon={<Tags className="w-8 h-8" />}
          title="Categories Architecture Ready"
          description="Category management foundation established. Custom category creation, color palette selection, and icon assignments are prepared."
          actionLabel="Create Category"
          onAction={() => alert('Category modal will open here.')}
        />
      </Card>
    </div>
  );
};

export default CategoriesPage;
