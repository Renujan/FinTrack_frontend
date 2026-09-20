import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import importService from '../../services/importService';
import { ImportPreviewResponse, ImportExecutionResponse } from '../../types/import';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'completed'>('upload');
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [execution, setExecution] = useState<ImportExecutionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a valid CSV file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await importService.uploadCsvPreview(file);
      setPreview(data);
      setStep('preview');
    } catch (err: any) {
      setError(err?.message || 'Failed to parse CSV file. Ensure correct format.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);

    try {
      const result = await importService.executeImport(preview.id);
      setExecution(result);
      setStep('completed');
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to execute CSV transaction import.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStep('upload');
    setPreview(null);
    setExecution(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Import Transactions from CSV">
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
            {error}
          </div>
        )}

        {/* Step 1: Upload CSV */}
        {step === 'upload' && (
          <form onSubmit={handleUploadPreview} className="space-y-4">
            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-slate-950/50 transition-colors">
              <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-200">
                Choose a CSV file to upload
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supported headers: title, amount, type, category, date
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-4 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="ghost" type="button" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={loading}
                disabled={!file}
                className="flex items-center gap-1.5"
              >
                <span>Upload & Preview</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Preview Results */}
        {step === 'preview' && preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-400 font-medium">Total Rows</p>
                <p className="text-base font-bold text-slate-200 mt-0.5">{preview.total_rows}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-400 font-medium">Valid</p>
                <p className="text-base font-bold text-emerald-300 mt-0.5">{preview.valid_rows}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <p className="text-rose-400 font-medium">Errors</p>
                <p className="text-base font-bold text-rose-300 mt-0.5">{preview.invalid_rows}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-400 font-medium">Duplicates</p>
                <p className="text-base font-bold text-amber-300 mt-0.5">{preview.duplicate_rows}</p>
              </div>
            </div>

            {preview.unmatched_categories && preview.unmatched_categories.length > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Unmatched category names ({preview.unmatched_categories.join(', ')}) will be automatically created.
                </span>
              </div>
            )}

            {/* Row Preview Table */}
            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-medium sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {preview.preview_rows.slice(0, 10).map((r) => (
                    <tr key={r.row} className="hover:bg-slate-800/30">
                      <td className="px-3 py-1.5 text-slate-500">{r.row}</td>
                      <td className="px-3 py-1.5 font-medium text-slate-200">{r.title}</td>
                      <td className="px-3 py-1.5 font-mono">${r.amount}</td>
                      <td className="px-3 py-1.5">{r.transaction_type}</td>
                      <td className="px-3 py-1.5 text-slate-400">{r.category || 'Default'}</td>
                      <td className="px-3 py-1.5 text-slate-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleExecuteImport}
                isLoading={loading}
                disabled={preview.valid_rows === 0}
              >
                Execute Import ({preview.valid_rows} Records)
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Completed */}
        {step === 'completed' && execution && (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-100">
              Import Completed Successfully!
            </h4>
            <p className="text-xs text-slate-400">
              Imported {execution.successful_rows} transactions into your finance tracker.
            </p>

            <div className="pt-3 border-t border-slate-800 flex justify-center">
              <Button variant="primary" onClick={handleReset}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CsvImportModal;
