import { WORKlOAD_TYPES } from '@/constants/workload';
import { Agent } from './types';

export const getCallsAssignedCount = (agent: Agent) => {
  return agent.assignedTasks.filter(
    (task) => task.platform === WORKlOAD_TYPES.CALL
  ).length;
};

export const getChatsAssignedCount = (agent: Agent) => {
  return agent.assignedTasks.filter(
    (task) => task.platform === WORKlOAD_TYPES.CHAT
  ).length;
};
