// lib/api/queue.ts

import { QueueData } from '@/features/ticket/types';
import { mapQueueData, QueueResponse } from '@/lib/mappers/queueMapper';
import { apiClient } from '../api-client';
import { getCustomError } from '../error-handler';

export const getQueue = async (): Promise<QueueData> => {
  try {
    const data: QueueResponse = await apiClient('/queue');
    return mapQueueData(data);
  } catch (error) {
    throw getCustomError('Failed to fetch queue data', error);
  }
};
