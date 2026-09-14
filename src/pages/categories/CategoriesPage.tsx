import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  CategorySummary,
  CategoryFilters,
  CategoryList,
  CategoryFormModal,
  CategoryDetailsModal,
  CategoryDeleteModal,
} from '../../components/categories';
import { Category, CategoryFilters as ICategoryFilters, CategoryFormData, CategoryStats } from '../../types/category';
import categoryService from '../../services/categoryService';
import parseApiError from '../../utils/errorHandler';
import { Plus } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [statsMap, setStatsMap] = useState<Record<number, CategoryStats>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ICategoryFilters>({
    search: '',
    ordering: 'name',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch Categories & Stats
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, statsRes] = await Promise.all([
        categoryService.getCategories(filters),
        categoryService.getCategoryStatsMap(),
      ]);
      setCategories(catRes.results);
      setStatsMap(statsRes);
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to load categories.');
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for Create / Update
  const handleFormSubmit = async (formData: CategoryFormData) => {
    if (categoryToEdit) {
      await categoryService.updateCategory(categoryToEdit.id, formData);
    } else {
      await categoryService.createCategory(formData);
    }
    await fetchData();
  };

  // Handler for Delete
  const handleDeleteConfirm = async (id: number) => {
    await categoryService.deleteCategory(id);
    await fetchData();
  };

  // Actions
  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleFilterChange = (newFilters: Partial<ICategoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', ordering: 'name' });
  };

  // Metrics
  const totalCategories = categories.length;
  const filteredCount = categories.length;
  const totalTransactionsLinked = Object.values(statsMap).reduce(
    (acc, curr) => acc + (curr.transaction_count || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 transition-all duration-300">
      <PageHeader
        title="Category Management"
        subtitle="Organize your income sources and expense categories connected directly to your transactions."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Category
          </Button>
        }
      />

      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      <CategorySummary
        metrics={{
          totalCategories,
          filteredCount,
          totalTransactionsLinked,
        }}
        isLoading={isLoading}
      />

      <CategoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <CategoryList
        categories={categories}
        statsMap={statsMap}
        isLoading={isLoading}
        viewMode={viewMode}
        onView={handleOpenDetails}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddCategory={handleOpenCreate}
      />

      {/* Modals */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        categoryToEdit={categoryToEdit}
      />

      <CategoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        category={selectedCategory}
        stats={selectedCategory ? statsMap[selectedCategory.id] : undefined}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <CategoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        category={categoryToDelete}
        stats={categoryToDelete ? statsMap[categoryToDelete.id] : undefined}
      />
    </div>
  );
};

export default CategoriesPage;
