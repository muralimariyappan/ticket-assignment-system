import { Agent } from './types';

export const countAssignedTasksByPlatform = (
  agents: Agent[],
  platform: string,
  options?: { exclude?: boolean }
): number => {
  return Object.values(agents).reduce((total, agent) => {
    const filteredTasks = agent.assignedTasks.filter((task) =>
      options?.exclude ? task.platform !== platform : task.platform === platform
    );
    return total + filteredTasks.length;
  }, 0);
};
