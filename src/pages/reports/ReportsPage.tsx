import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import GeneratedReportsTable from '../../components/reports/GeneratedReportsTable';
import QuickReportsView from '../../components/reports/QuickReportsView';
import ReportGeneratorModal from '../../components/reports/ReportGeneratorModal';
import reportService from '../../services/reportService';
import { FinancialReport, GenerateReportPayload } from '../../types/report';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Plus, RefreshCw, FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchReports = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = async (payload: GenerateReportPayload) => {
    setIsSubmitting(true);
    try {
      await reportService.generateReport(payload);
      await fetchReports();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (id: number) => {
    try {
      await reportService.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete report', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Reports & Statements"
        subtitle="Generate, preview, and download custom financial statements in CSV and JSON formats."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchReports(true)}
              isLoading={isRefreshing}
              title="Refresh Reports List"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Report</span>
            </Button>
          </div>
        }
      />

      {/* Quick Financial Metrics Overview */}
      <QuickReportsView />

      {/* Reports Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Generated Reports History</span>
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" label="Loading financial reports..." />
          </div>
        ) : (
          <GeneratedReportsTable
            reports={reports}
            onDelete={handleDeleteReport}
            isLoading={loading}
          />
        )}
      </div>

      {/* Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerateReport}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ReportsPage;
