'use client';

import { useDashboardData } from './hooks/useDashboardData';
import { SystemStatus } from './components/SystemStatus';

export default function Dashboard() {
  const { dashboardData, isDashboardLoading } = useDashboardData();

  return (
    <div className="space-y-4 p-6">
      <SystemStatus data={dashboardData} loading={isDashboardLoading} />
    </div>
  );
}
