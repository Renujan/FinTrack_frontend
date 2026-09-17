import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Pagination from '../../components/common/Pagination';
import BudgetSummary from '../../components/budgets/BudgetSummary';
import BudgetFilters from '../../components/budgets/BudgetFilters';
import BudgetList from '../../components/budgets/BudgetList';
import BudgetFormModal from '../../components/budgets/BudgetFormModal';
import BudgetDetailsModal from '../../components/budgets/BudgetDetailsModal';
import BudgetDeleteModal from '../../components/budgets/BudgetDeleteModal';
import budgetService from '../../services/budgetService';
import categoryService from '../../services/categoryService';
import useAuth from '../../hooks/useAuth';
import { Budget, BudgetFiltersParams, BudgetFormData, BudgetSummaryData } from '../../types/budget';
import { Category } from '../../types/category';
import parseApiError from '../../utils/errorHandler';
import { Plus, RefreshCw } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  // State Management
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summaryData, setSummaryData] = useState<BudgetSummaryData | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [filterParams, setFilterParams] = useState<BudgetFiltersParams>({
    page: 1,
    page_size: 10,
    ordering: '-start_date',
  });

  // Modal Controls
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [viewingBudget, setViewingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  // Fetch Categories for dropdown selection
  const loadCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories({ page_size: 100 });
      setCategories(res.results || []);
    } catch {
      // Non-critical if categories fail to load
    }
  }, []);

  // Fetch Budget Summary metrics
  const loadSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const summary = await budgetService.getBudgetSummary();
      setSummaryData(summary);
    } catch {
      // Summary call fallback
      setSummaryData(null);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  // Fetch Budgets List
  const loadBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await budgetService.getBudgets(filterParams);
      setBudgets(res.results || []);
      setTotalCount(res.count || (res.results ? res.results.length : 0));
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to fetch budgets list.');
      setError(parsed.message);
      setBudgets([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadBudgets();
    loadSummary();
  }, [loadBudgets, loadSummary]);

  // Handlers
  const handleFilterChange = (newFilters: BudgetFiltersParams) => {
    setFilterParams((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilterParams({
      page: 1,
      page_size: 10,
      ordering: '-start_date',
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingBudget(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: BudgetFormData) => {
    if (editingBudget) {
      await budgetService.updateBudget(editingBudget.id, formData);
    } else {
      await budgetService.createBudget(formData);
    }
    await loadBudgets();
    await loadSummary();
  };

  const handleDeleteConfirm = async (budget: Budget) => {
    await budgetService.deleteBudget(budget.id);
    await loadBudgets();
    await loadSummary();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Budget Planning & Limits"
        subtitle="Track spending limits per category or overall, monitor usage warnings, and manage period goals."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => {
                loadBudgets();
                loadSummary();
              }}
              title="Refresh budget data"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateModal}
            >
              Set New Budget
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <BudgetSummary
        summary={summaryData}
        currency={currency}
        isLoading={isSummaryLoading}
      />

      {/* Filters Bar */}
      <BudgetFilters
        filters={filterParams}
        categories={categories}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Budgets List Grid */}
      <BudgetList
        budgets={budgets}
        currency={currency}
        isLoading={isLoading}
        error={error}
        onRefresh={loadBudgets}
        onCreateNew={handleOpenCreateModal}
        onViewDetails={(b) => setViewingBudget(b)}
        onEdit={handleOpenEditModal}
        onDelete={(b) => setDeletingBudget(b)}
      />

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination
            currentPage={filterParams.page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <BudgetFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBudget}
        categories={categories}
      />

      {/* View Details Modal */}
      <BudgetDetailsModal
        isOpen={Boolean(viewingBudget)}
        onClose={() => setViewingBudget(null)}
        budget={viewingBudget}
        currency={currency}
        onEdit={handleOpenEditModal}
        onDelete={(b) => setDeletingBudget(b)}
      />

      {/* Delete Confirmation Modal */}
      <BudgetDeleteModal
        isOpen={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleDeleteConfirm}
        budget={deletingBudget}
        currency={currency}
      />
    </div>
  );
};

export default BudgetsPage;
