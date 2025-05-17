import { useState } from 'react';
import { closeTask as closeTaskApi } from '@/lib/api/tasks';
import { Agent, Task } from '../types';

export const useTasks = () => {
  const [isLoading, setLoading] = useState(false);

  const closeTask = async (agent: Agent, task: Task) => {
    try {
      setLoading(true);
      await closeTaskApi(agent, task);
    } finally {
      setLoading(false);
    }
  };

  return { closeTask, isLoading };
};
