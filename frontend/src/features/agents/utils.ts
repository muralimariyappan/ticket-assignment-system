import { WORKLOAD_TYPES } from '@/constants/workload';
import { Agent } from './types';

export const getCallsAssignedCount = (agent: Agent) => {
  return agent.assignedTasks.filter(
    (task) => task.platform === WORKLOAD_TYPES.CALL
  ).length;
};

export const getChatsAssignedCount = (agent: Agent) => {
  return agent.assignedTasks.filter(
    (task) => task.platform === WORKLOAD_TYPES.CHAT
  ).length;
};
