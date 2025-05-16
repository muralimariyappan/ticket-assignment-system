import AgentWorkLoadContainer from '@/features/agents/AgentWorkloadContainer';
import Dashboard from '@/features/dashboard/Dashboard';
import TicketQueueContainer from '@/features/ticket/TicketQueueContainer';

export default function Home() {
  return (
    <>
      <Dashboard />
      <div className="flex">
        <div className="flex-1">
          <TicketQueueContainer />
        </div>
        <div className="flex-1">
          <AgentWorkLoadContainer />
        </div>
      </div>
    </>
  );
}
