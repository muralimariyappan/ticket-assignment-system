import { Agent, Task } from '@/features/agents/types';
import { apiClient } from '../api-client';
import { getCustomError } from '../error-handler';

export const closeTask = async (agent: Agent, task: Task): Promise<void> => {
  try {
    await apiClient(
      `/tasks/complete?agent_identifier=${agent.id}&task_id=${task.id}&by_name=false`,
      {
        method: 'POST',
      }
    );
  } catch (error) {
    throw getCustomError('Failed to close task', error);
  }
};
