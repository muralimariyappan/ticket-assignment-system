import { useEffect, useState } from 'react';
import { getQueue } from '@/lib/api/queue';
import { QueueData } from '../types';

export const useQueueData = () => {
  const [data, setData] = useState<QueueData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      const result = await getQueue();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch queue data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return { queueData: data, isQueueLoading: isLoading, error };
};
