import React from 'react';
import Card from '../ui/Card';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard metrics">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-7 w-56 bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-9 w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* Metrics Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-28 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-800 rounded" />
              <div className="h-7 w-7 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-6 w-32 bg-slate-800 rounded-md" />
            <div className="h-3 w-20 bg-slate-800/60 rounded" />
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-72">
          <div className="h-5 w-48 bg-slate-800 rounded mb-4" />
          <div className="h-40 bg-slate-800/40 rounded-xl" />
        </Card>

        <Card className="h-72">
          <div className="h-5 w-40 bg-slate-800 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-800/40 rounded-xl" />
            ))}
          </div>
        </Card>
      </div>

      {/* Secondary Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64">
            <div className="h-5 w-36 bg-slate-800 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <div key={j} className="h-10 bg-slate-800/40 rounded-lg" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
