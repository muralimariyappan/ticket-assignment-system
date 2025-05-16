'use client';

import { useDashboardData } from './hooks/useDashboardData';
import { SystemStatus } from './components/SystemStatus';

export default function Dashboard() {
  const { dashboardData, isDashboardLoading } = useDashboardData();

  return <SystemStatus data={dashboardData} loading={isDashboardLoading} />;
}
