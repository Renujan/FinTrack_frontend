import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface DashboardErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  message = 'Unable to load dashboard financial data. Please try again.',
  onRetry,
}) => {
  return (
    <Card className="border-rose-500/30 bg-rose-950/10 p-8 text-center my-6">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            Dashboard Data Error
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Loading Dashboard
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DashboardErrorState;
