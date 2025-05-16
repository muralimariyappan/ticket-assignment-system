import Dashboard from '@/features/dashboard/Dashboard';
import TicketQueueContainer from '@/features/ticket/TicketQueueContainer';

export default function Home() {
  return (
    <>
      <Dashboard />
      <TicketQueueContainer />
    </>
  );
}
