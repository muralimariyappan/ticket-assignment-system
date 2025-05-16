'use client';

import ActiveAgents from '@/features/agents/components/ActiveAgents';
import AgentWorkload from '@/features/agents/components/AgentWorkload';
import { useAgents } from '@/features/agents/hooks/useAgents';
import Dashboard from '@/features/dashboard/Dashboard';
import TicketQueueContainer from '@/features/ticket/TicketQueueContainer';

export default function Home() {
  const { agents, loading } = useAgents();
  return (
    <>
      <Dashboard />
      <div className="flex">
        <div className="flex-1">
          <TicketQueueContainer />
        </div>
        <div className="flex-1">
          <AgentWorkload agents={agents} loading={loading} />
        </div>
      </div>
      <ActiveAgents agents={agents} loading={loading} />
    </>
  );
}
