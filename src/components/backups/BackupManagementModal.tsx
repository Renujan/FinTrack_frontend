import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import backupService from '../../services/backupService';
import { BackupRecord, RestoreValidationResponse } from '../../types/backup';
import { Download, Trash2, Plus, ShieldCheck, FileCheck, HardDrive } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BackupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupManagementModal: React.FC<BackupManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [activeTab, setActiveTab] = useState<'manage' | 'validate'>('manage');
  const [valFile, setValFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<RestoreValidationResponse | null>(null);
  const [valLoading, setValLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const data = await backupService.getBackups();
      setBackups(data);
    } catch (err) {
      console.error('Failed to fetch backups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBackups();
    }
  }, [isOpen]);

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setError(null);

    const name = backupName.trim() || `Backup_${new Date().toISOString().split('T')[0]}`;

    try {
      await backupService.createBackup({
        name,
        backup_type: 'FULL',
        retention_days: 30,
      });
      setBackupName('');
      await fetchBackups();
    } catch (err: any) {
      setError(err?.message || 'Failed to create data backup.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteBackup = async (id: number) => {
    try {
      await backupService.deleteBackup(id);
      setBackups((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Failed to delete backup', err);
    }
  };

  const handleValidateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valFile) return;
    setValLoading(true);
    setError(null);

    try {
      const res = await backupService.validateRestore(valFile);
      setValidationResult(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to validate JSON backup file.');
    } finally {
      setValLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Financial Data Backups & Restore Preview">
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'manage'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manage Backups
          </button>
          <button
            onClick={() => setActiveTab('validate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'validate'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Validate Restore File
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
            {error}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-4">
            {/* Create Backup Form */}
            <form onSubmit={handleCreateBackup} className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="New Backup Name"
                  placeholder="e.g. September Financial Snapshot"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                />
              </div>
              <Button variant="primary" size="sm" type="submit" isLoading={createLoading}>
                <Plus className="w-4 h-4 mr-1" />
                <span>Create Backup</span>
              </Button>
            </form>

            {/* Backup Table */}
            {loading ? (
              <div className="flex justify-center p-8">
                <LoadingSpinner size="md" />
              </div>
            ) : backups.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No backup files created yet.
              </p>
            ) : (
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-medium sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Created</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {backups.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-medium text-slate-200">{b.name}</td>
                        <td className="px-3 py-2 text-slate-400 flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                          <span>{b.file_size ? `${(b.file_size / 1024).toFixed(1)} KB` : '—'}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-400">
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={backupService.getDownloadUrl(b.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                              title="Download JSON Backup"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 text-rose-400 hover:bg-rose-500/10"
                              onClick={() => handleDeleteBackup(b.id)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'validate' && (
          <div className="space-y-4">
            <form onSubmit={handleValidateFile} className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Upload JSON Backup Payload to Validate Schema & Preview Records
              </label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files && setValFile(e.target.files[0])}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-500/10 file:text-emerald-400 cursor-pointer"
              />
              <Button variant="primary" size="sm" type="submit" isLoading={valLoading} disabled={!valFile}>
                <FileCheck className="w-4 h-4 mr-1" />
                <span>Run Restore Validation</span>
              </Button>
            </form>

            {validationResult && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Validation Status: {validationResult.valid ? 'Valid Payload' : 'Invalid'}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{validationResult.note}</p>
                {validationResult.summary && (
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
                    <div className="p-2 bg-slate-900 rounded">
                      <p className="text-slate-500">Transactions</p>
                      <p className="font-bold text-slate-200">{validationResult.summary.transactions_count}</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <p className="text-slate-500">Categories</p>
                      <p className="font-bold text-slate-200">{validationResult.summary.categories_count}</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <p className="text-slate-500">Goals</p>
                      <p className="font-bold text-slate-200">{validationResult.summary.financial_goals_count}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BackupManagementModal;
