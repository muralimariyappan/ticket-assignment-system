'use client';

import TicketQueue from './components/TicketQueue';
import { useQueueData } from './hooks/useQueueData';

export default function TicketQueueContainer() {
  const { queueData, isQueueLoading, error } = useQueueData();

  return (
    <TicketQueue queueData={queueData} loading={isQueueLoading} error={error} />
  );
}
