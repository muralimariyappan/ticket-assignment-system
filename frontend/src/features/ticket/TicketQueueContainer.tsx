'use client';

import TicketQueue from './components/TicketQueue';
import { useQueueData } from './hooks/useQueueData';

export default function TicketQueueContainer() {
  const { queueData, isQueueLoading } = useQueueData();

  return (
    <div className="space-y-4 p-6">
      <TicketQueue queueData={queueData} loading={isQueueLoading} />
    </div>
  );
}
