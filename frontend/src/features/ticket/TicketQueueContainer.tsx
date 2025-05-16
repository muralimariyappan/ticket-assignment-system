'use client';

import TicketQueue from './components/TicketQueue';
import { useQueueData } from './hooks/useQueueData';

export default function TicketQueueContainer() {
  const { queueData, isQueueLoading } = useQueueData();

  return <TicketQueue queueData={queueData} loading={isQueueLoading} />;
}
