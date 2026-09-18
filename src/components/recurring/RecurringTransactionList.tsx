import React from 'react';
import Card from '../ui/Card';
import EmptyState from '../common/EmptyState';
import RecurringTransactionCard from './RecurringTransactionCard';
import { RecurringTransaction } from '../../types/recurring';
import { Repeat, Plus } from 'lucide-react';

interface RecurringTransactionListProps {
  transactions: RecurringTransaction[];
  isLoading: boolean;
  currency?: string;
  onViewDetails: (item: RecurringTransaction) => void;
  onEdit: (item: RecurringTransaction) => void;
  onToggleStatus: (item: RecurringTransaction) => void;
  onExecute: (item: RecurringTransaction) => void;
  onDelete: (item: RecurringTransaction) => void;
  onAddRecurring: () => void;
  activeActionId?: number | null;
}

export const RecurringTransactionList: React.FC<RecurringTransactionListProps> = ({
  transactions,
  isLoading,
  currency = 'USD',
  onViewDetails,
  onEdit,
  onToggleStatus,
  onExecute,
  onDelete,
  onAddRecurring,
  activeActionId = null,
}) => {
  // Skeleton loader cards
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 bg-slate-900/60 border-slate-800 animate-pulse">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                  <div className="h-3 w-32 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-6 w-24 bg-slate-800 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state if no transactions
  if (transactions.length === 0) {
    return (
      <Card className="p-8 bg-slate-900/60 border-slate-800">
        <EmptyState
          icon={<Repeat className="w-10 h-10 text-indigo-400" />}
          title="No recurring transactions found"
          description="Create recurring transaction rules to automatically track your regular income and subscriptions."
          actionLabel="Add Recurring Transaction"
          onAction={onAddRecurring}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <RecurringTransactionCard
          key={tx.id}
          transaction={tx}
          currency={currency}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onExecute={onExecute}
          onDelete={onDelete}
          isActionLoading={activeActionId === tx.id}
        />
      ))}
    </div>
  );
};

export default RecurringTransactionList;
