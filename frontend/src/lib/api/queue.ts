// lib/api/queue.ts

import { BASE_URL } from '@/constants/api-endpoints';
import { QueueData } from '@/features/dashboard/types';
import { mapQueueData } from '@/lib/mappers/queueMapper';

export const getQueue = async (): Promise<QueueData> => {
  const res = await fetch(`${BASE_URL}/queue`);
  if (!res.ok) {
    throw new Error('Failed to fetch queue data');
  }

  const data = await res.json();
  return mapQueueData(data);
};
