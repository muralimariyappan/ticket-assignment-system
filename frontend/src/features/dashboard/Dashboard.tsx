'use client';

import { useDashboardData } from './hooks/useDashboardData';
import { SystemStatus } from './components/SystemStatus';
import TicketQueue from './components/TicketQueue';
import { useQueueData } from './hooks/useQueueData';

export default function DashboardPage() {
  const { dashboardData, isDashboardLoading } = useDashboardData();
  const { queueData, isQueueLoading } = useQueueData();

  return (
    <div className="space-y-4 p-6">
      <SystemStatus data={dashboardData} loading={isDashboardLoading} />
      <TicketQueue queueData={queueData} loading={isQueueLoading} />
      {/* TicketQueue, AgentWorkload, ActiveAgents to follow */}
    </div>
  );
}
