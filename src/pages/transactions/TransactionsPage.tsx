import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import TransactionSummary from '../../components/transactions/TransactionSummary';
import TransactionFilters from '../../components/transactions/TransactionFilters';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionFormModal from '../../components/transactions/TransactionFormModal';
import TransactionDetailsModal from '../../components/transactions/TransactionDetailsModal';
import TransactionDeleteModal from '../../components/transactions/TransactionDeleteModal';
import transactionService from '../../services/transactionService';
import categoryService from '../../services/categoryService';
import useAuth from '../../hooks/useAuth';
import parseApiError from '../../utils/errorHandler';
import { Category, Transaction, TransactionFilters as FilterState, TransactionFormData } from '../../types/transaction';
import { Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const userCurrency = user?.currency || 'USD';

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter & Pagination state
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    page_size: 10,
    ordering: '-date',
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Show auto-expiring toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch categories list
  const loadCategories = useCallback(async () => {
    try {
      const catList = await categoryService.getCategories();
      setCategories(catList);
    } catch {
      // Non-blocking fallback if categories fails
    }
  }, []);

  // Fetch transactions list based on active filters
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await transactionService.getTransactions(filters);
      setTransactions(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to fetch transactions from server.');
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Compute summary totals for loaded dataset
  const { incomeTotal, expenseTotal, netTotal } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const amt = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
      const numAmt = isNaN(amt) ? 0 : amt;

      if (tx.transaction_type === 'INCOME') {
        income += numAmt;
      } else if (tx.transaction_type === 'EXPENSE') {
        expense += numAmt;
      }
    });

    return {
      incomeTotal: income,
      expenseTotal: expense,
      netTotal: income - expense,
    };
  }, [transactions]);

  // Filter change handlers
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
      ordering: '-date',
    });
  };

  // Modal open triggers
  const handleOpenCreateModal = () => {
    setEditingTransaction(null);
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenDetailsModal = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsDetailOpen(true);
  };

  const handleOpenDeleteModal = (tx: Transaction) => {
    setDeletingTransaction(tx);
    setFormError(null);
    setIsDeleteOpen(true);
  };

  // Form submit (Create or Edit)
  const handleFormSubmit = async (formData: TransactionFormData) => {
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction.id, formData);
        showToast('Transaction updated successfully.');
      } else {
        await transactionService.createTransaction(formData);
        showToast('Transaction created successfully.');
      }

      setIsFormOpen(false);
      setEditingTransaction(null);
      await fetchTransactions();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to save transaction.');
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete transaction confirm
  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await transactionService.deleteTransaction(deletingTransaction.id);
      showToast('Transaction deleted successfully.');
      setIsDeleteOpen(false);
      setDeletingTransaction(null);
      await fetchTransactions();
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'Failed to delete transaction.');
      setFormError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Banner */}
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

      {/* Header */}
      <PageHeader
        title="Transactions Management"
        subtitle="Track, filter, create, and manage all your income and expense records."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTransactions}
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
              Add Transaction
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <TransactionSummary
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        netTotal={netTotal}
        totalCount={totalCount}
        currency={userCurrency}
      />

      {/* Filters Bar */}
      <TransactionFilters
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
          onRetry={fetchTransactions}
          actionLabel="Retry Request"
        />
      )}

      {/* Main Transactions Table & List */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        currency={userCurrency}
        onViewDetails={handleOpenDetailsModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onAddTransaction={handleOpenCreateModal}
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
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        categories={categories}
        isLoading={isSubmitting}
        externalError={formError}
        fieldErrors={fieldErrors}
      />

      {/* Details View Modal */}
      <TransactionDetailsModal
        isOpen={isDetailOpen}
        transaction={selectedTransaction}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        currency={userCurrency}
      />

      {/* Delete Confirmation Modal */}
      <TransactionDeleteModal
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

export default TransactionsPage;
