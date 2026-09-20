import React from 'react';
import { FinancialReport } from '../../types/report';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import reportService from '../../services/reportService';
import { Download, Trash2, FileText, Calendar, HardDrive } from 'lucide-react';

interface GeneratedReportsTableProps {
  reports: FinancialReport[];
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export const GeneratedReportsTable: React.FC<GeneratedReportsTableProps> = ({
  reports,
  onDelete,
  isLoading = false,
}) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'PROCESSING':
      case 'PENDING':
        return <Badge variant="warning">Processing</Badge>;
      case 'EXPIRED':
        return <Badge variant="neutral">Expired</Badge>;
      default:
        return <Badge variant="danger">{status}</Badge>;
    }
  };

  if (reports.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-slate-950/50 border border-slate-800/80 rounded-2xl">
        <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-300">No Reports Generated Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Click &quot;Generate New Report&quot; above to create downloadable statement reports in CSV or JSON format.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-medium">
          <tr>
            <th className="px-4 py-3">Report Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Format</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Created Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{report.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-400">
                {report.report_type.replace(/_/g, ' ')}
              </td>
              <td className="px-4 py-3 font-mono text-emerald-400 font-medium">
                {report.format}
              </td>
              <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
              <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatFileSize(report.file_size)}</span>
              </td>
              <td className="px-4 py-3 text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {report.status === 'COMPLETED' && (
                    <a
                      href={reportService.getDownloadUrl(report.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5"
                    onClick={() => onDelete(report.id)}
                    title="Delete report"
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
  );
};

export default GeneratedReportsTable;
