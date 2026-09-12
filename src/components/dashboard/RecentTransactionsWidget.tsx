import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EmptyState from '../common/EmptyState';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Receipt, Plus } from 'lucide-react';
import { RecentTransactionItem } from '../../types/dashboard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export interface RecentTransactionsWidgetProps {
  transactions?: RecentTransactionItem[];
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  transactions = [],
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  return (
    <Card
      title="Recent Transactions"
      subtitle="Latest recorded account activity"
      headerAction={
        transactions.length > 0 ? (
          <button
            onClick={() => navigate('/transactions')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : undefined
      }
    >
      {transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-8 h-8 text-slate-500" />}
          title="No transactions yet"
          description="You haven't added any income or expense transactions."
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/transactions')}
            >
              Add First Transaction
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const isIncome = tx.transaction_type === 'INCOME';
            const amountNum = parseFloat(tx.amount) || 0;

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {tx.title || 'Untitled Transaction'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tx.category_name || tx.category?.name || 'Uncategorized'} &bull; {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold font-mono ${
                    isIncome ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(amountNum, currency)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentTransactionsWidget;
