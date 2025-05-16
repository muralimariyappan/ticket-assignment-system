'use client';

import { useDashboardData } from './hooks/useDashboardData';
import { SystemStatus } from './components/SystemStatus';

export default function DashboardPage() {
  const { data, loading } = useDashboardData();

  if (loading || !data) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-6">
      <SystemStatus data={data} />
      {/* TicketQueue, AgentWorkload, ActiveAgents to follow */}
    </div>
  );
}
