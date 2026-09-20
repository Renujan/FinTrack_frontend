import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import exportService from '../../services/exportService';
import { CreateExportPayload, ExportType, ExportFormat } from '../../types/export';
import { Download, FileText, Calendar, Database } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ExportType;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'TRANSACTIONS',
}) => {
  const [name, setName] = useState('');
  const [exportType, setExportType] = useState<ExportType>(defaultType);
  const [format, setFormat] = useState<ExportFormat>('CSV');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    const payloadName = name.trim() || `${exportType}_export_${new Date().toISOString().split('T')[0]}`;

    try {
      const result = await exportService.createExport({
        name: payloadName,
        export_type: exportType,
        format,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      const url = exportService.getDownloadUrl(result.id);
      setDownloadUrl(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to trigger data export.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setDownloadUrl(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Export Financial Data">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
            {error}
          </div>
        )}

        {downloadUrl && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
            <p className="text-xs font-semibold text-emerald-300">
              Export generated successfully!
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download File Now</span>
            </a>
          </div>
        )}

        <Input
          label="Export Name (Optional)"
          placeholder="e.g. Q3 Financial Export"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<FileText className="w-4 h-4" />}
        />

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Target Dataset</span>
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as ExportType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="TRANSACTIONS">Transactions Dataset</option>
            <option value="CATEGORIES">Categories List</option>
            <option value="BUDGETS">Budgets & Progress</option>
            <option value="GOALS">Financial Goals</option>
            <option value="RECURRING_TRANSACTIONS">Recurring Schedules</option>
            <option value="FULL_FINANCIAL_DATA">Full Financial Snapshot</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('CSV')}
              className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                format === 'CSV'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              CSV Spreadsheet
            </button>
            <button
              type="button"
              onClick={() => setFormat('JSON')}
              className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                format === 'JSON'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              JSON Data Format
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date (Optional)"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
          <Input
            label="End Date (Optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={handleReset}>
            Close
          </Button>
          <Button variant="primary" type="submit" isLoading={loading}>
            Generate & Download Export
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DataExportModal;
