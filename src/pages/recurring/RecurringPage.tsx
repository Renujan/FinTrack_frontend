import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import {
  RecurringTransactionSummary,
  RecurringTransactionFilters,
  RecurringTransactionList,
  RecurringTransactionFormModal,
  RecurringTransactionDetailsModal,
  RecurringTransactionDeleteModal,
} from '../../components/recurring';
import recurringService from '../../services/recurringService';
import categoryService from '../../services/categoryService';
import useAuth from '../../hooks/useAuth';
import parseApiError from '../../utils/errorHandler';
import { Category } from '../../types/category';
import {
  RecurringTransaction,
  RecurringTransactionFilters as FilterState,
  RecurringTransactionFormData,
} from '../../types/recurring';
import { Plus, RefreshCw, CheckCircle2, Repeat } from 'lucide-react';

export const RecurringPage: React.FC = () => {
  const { user } = useAuth();
  const userCurrency = user?.currency || 'USD';

  // Dataset states
  const [recurringList, setRecurringList] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active item action ID state for spinners
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter & Pagination state
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    page_size: 10,
    ordering: 'next_run_date',
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RecurringTransaction | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deletingTransaction, setDeletingTransaction] = useState<RecurringTransaction | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Auto-expiring toast notifier
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch Categories
  const loadCategories = useCallback(async () => {
    try {
      const catList = await categoryService.getCategories();
      setCategories(catList);
    } catch {
      // Non-blocking fallback
    }
  }, []);

  // Fetch Recurring Transactions
  const fetchRecurringTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recurringService.getRecurringTransactions(filters);
      setRecurringList(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to fetch recurring transactions from server.');
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    fetchRecurringTransactions();
  }, [fetchRecurringTransactions]);

  // Filter Handlers
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      page_size: 10,
      ordering: 'next_run_date',
    });
  };

  // Modal Open Handlers
  const handleOpenCreateModal = () => {
    setEditingTransaction(null);
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item: RecurringTransaction) => {
    setEditingTransaction(item);
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenDetailsModal = (item: RecurringTransaction) => {
    setSelectedTransaction(item);
    setIsDetailOpen(true);
  };

  const handleOpenDeleteModal = (item: RecurringTransaction) => {
    setDeletingTransaction(item);
    setFormError(null);
    setIsDeleteOpen(true);
  };

  // Form Submit (Create or Edit)
  const handleFormSubmit = async (formData: RecurringTransactionFormData) => {
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      if (editingTransaction) {
        await recurringService.updateRecurring(editingTransaction.id, formData);
        showToast('Recurring transaction schedule updated successfully.');
      } else {
        await recurringService.createRecurring(formData);
        showToast('Recurring transaction schedule created successfully.');
      }

      setIsFormOpen(false);
      setEditingTransaction(null);
      await fetchRecurringTransactions();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to save recurring transaction schedule.');
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Pause / Resume Action
  const handleToggleStatus = async (item: RecurringTransaction) => {
    setActiveActionId(item.id);
    try {
      if (item.is_active) {
        const updated = await recurringService.pauseRecurring(item.id);
        showToast(`Schedule "${item.name}" paused.`);
        if (selectedTransaction?.id === item.id) {
          setSelectedTransaction(updated);
        }
      } else {
        const updated = await recurringService.resumeRecurring(item.id);
        showToast(`Schedule "${item.name}" resumed.`);
        if (selectedTransaction?.id === item.id) {
          setSelectedTransaction(updated);
        }
      }
      await fetchRecurringTransactions();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to update schedule status.');
      showToast(parsed.message, 'error');
    } finally {
      setActiveActionId(null);
    }
  };

  // Execute Now Manual Action
  const handleExecuteNow = async (item: RecurringTransaction) => {
    setActiveActionId(item.id);
    try {
      const res = await recurringService.executeRecurring(item.id);
      showToast(res.detail || `Executed recurring schedule "${item.name}" successfully.`);
      if (res.recurring_transaction && selectedTransaction?.id === item.id) {
        setSelectedTransaction(res.recurring_transaction);
      }
      await fetchRecurringTransactions();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to execute recurring schedule.');
      showToast(parsed.message, 'error');
    } finally {
      setActiveActionId(null);
    }
  };

  // Delete Action Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await recurringService.deleteRecurring(deletingTransaction.id);
      showToast('Recurring transaction schedule deleted successfully.');
      setIsDeleteOpen(false);
      setDeletingTransaction(null);
      await fetchRecurringTransactions();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to delete recurring transaction schedule.');
      setFormError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950 border-rose-500/40 text-rose-300'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Recurring Transactions"
        subtitle="Automate subscriptions, salaries, bills, and repeating income/expense cycles."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecurringTransactions}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Recurring Transaction
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <RecurringTransactionSummary
        transactions={recurringList}
        totalCount={totalCount}
        currency={userCurrency}
      />

      {/* Filters Bar */}
      <RecurringTransactionFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isLoading={isLoading}
      />

      {/* Error Alert */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchRecurringTransactions}
          actionLabel="Retry Request"
        />
      )}

      {/* Recurring Transactions List */}
      <RecurringTransactionList
        transactions={recurringList}
        isLoading={isLoading}
        currency={userCurrency}
        onViewDetails={handleOpenDetailsModal}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onExecute={handleExecuteNow}
        onDelete={handleOpenDeleteModal}
        onAddRecurring={handleOpenCreateModal}
        activeActionId={activeActionId}
      />

      {/* Pagination Controls */}
      <Pagination
        currentPage={filters.page || 1}
        totalCount={totalCount}
        pageSize={filters.page_size || 10}
        onPageChange={(page) => handleFilterChange({ page })}
        isLoading={isLoading}
      />

      {/* Form Modal (Create & Edit) */}
      <RecurringTransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        categories={categories}
        isLoading={isSubmitting}
        externalError={formError}
        fieldErrors={fieldErrors}
      />

      {/* Details Modal */}
      <RecurringTransactionDetailsModal
        isOpen={isDetailOpen}
        transaction={selectedTransaction}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onToggleStatus={handleToggleStatus}
        onExecute={handleExecuteNow}
        currency={userCurrency}
      />

      {/* Delete Modal */}
      <RecurringTransactionDeleteModal
        isOpen={isDeleteOpen}
        transaction={deletingTransaction}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        error={formError}
        currency={userCurrency}
      />
    </div>
  );
};

export default RecurringPage;
