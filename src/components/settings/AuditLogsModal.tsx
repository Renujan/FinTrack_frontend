import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import auditService from '../../services/auditService';
import { AuditLog } from '../../types/audit';
import { ShieldAlert, Clock, Globe } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      auditService
        .getAuditLogs()
        .then((data) => setLogs(data))
        .catch((err) => console.error('Failed to load audit logs', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Security & Access Audit Logs">
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="md" label="Loading security audit records..." />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">No Security Audit Events</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-medium sticky top-0">
                <tr>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Resource</th>
                  <th className="px-3 py-2">IP Address</th>
                  <th className="px-3 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-3 py-2 font-semibold text-emerald-400">{l.action}</td>
                    <td className="px-3 py-2 text-slate-300">{l.resource_type}</td>
                    <td className="px-3 py-2 text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>{l.ip_address || '127.0.0.1'}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(l.timestamp).toLocaleString()}</span>
                      </div>
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

export default AuditLogsModal;
