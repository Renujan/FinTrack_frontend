import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import recurringService from '../../services/recurringService';
import { RecurringTransaction, RecurringTransactionExecution } from '../../types/recurring';
import { Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface RecurringHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recurring: RecurringTransaction | null;
}

export const RecurringHistoryDrawer: React.FC<RecurringHistoryDrawerProps> = ({
  isOpen,
  onClose,
  recurring,
}) => {
  const [history, setHistory] = useState<RecurringTransactionExecution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && recurring) {
      setLoading(true);
      recurringService
        .getRecurringHistory(recurring.id)
        .then((res) => setHistory(res.results || []))
        .catch((err) => console.error('Failed to load recurring history', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, recurring]);

  if (!recurring) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Execution History: ${recurring.title}`}>
      <div className="space-y-4">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex justify-between items-center">
          <div>
            <p className="font-semibold text-slate-200">{recurring.title}</p>
            <p className="text-[11px] text-slate-400 capitalize">
              Frequency: {recurring.frequency.toLowerCase()} (${Number(recurring.amount).toFixed(2)})
            </p>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              recurring.is_active
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            {recurring.is_active ? 'ACTIVE' : 'PAUSED'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="md" label="Loading execution history..." />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">No Executions Recorded Yet</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
              History logs are created when automated schedules run or when manually executed.
            </p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-medium sticky top-0">
                <tr>
                  <th className="px-3 py-2">Execution Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Tx ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/30">
                    <td className="px-3 py-2 font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(h.executed_at).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {h.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Success</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-400 font-mono text-[11px]">
                      {h.generated_transaction || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RecurringHistoryDrawer;
