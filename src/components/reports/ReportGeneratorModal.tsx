import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { GenerateReportPayload, ReportType, ReportFormat } from '../../types/report';
import { FileText, Calendar, FileType } from 'lucide-react';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: GenerateReportPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [reportType, setReportType] = useState<ReportType>('FINANCIAL_SUMMARY');
  const [format, setFormat] = useState<ReportFormat>('CSV');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a report title.');
      return;
    }
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        report_type: reportType,
        format,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      setName('');
      setStartDate('');
      setEndDate('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to generate report.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Financial Report">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
            {error}
          </div>
        )}

        <Input
          label="Report Name / Title"
          placeholder="e.g. Q3 2026 Financial Summary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<FileText className="w-4 h-4" />}
          required
        />

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="FINANCIAL_SUMMARY">Financial Summary</option>
            <option value="SPENDING">Spending Breakdown</option>
            <option value="INCOME">Income Analysis</option>
            <option value="BUDGET">Budget Performance</option>
            <option value="GOALS">Savings Goals Progress</option>
            <option value="MONTHLY">Monthly Statement</option>
            <option value="YEARLY">Yearly Statement</option>
            <option value="CUSTOM_RANGE">Custom Range</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('CSV')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                format === 'CSV'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileType className="w-4 h-4" />
              <span>CSV Spreadsheet</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('JSON')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                format === 'JSON'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>JSON Data</span>
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
          <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Generate Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportGeneratorModal;
