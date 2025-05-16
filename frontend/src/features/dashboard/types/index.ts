import { Agent as AgentFeature } from '@/features/agents/types';

export type Agent = Pick<AgentFeature, 'languageSkills' | 'assignedTasks'>;

export interface DashboardData {
  assignedTicketIds: string[];
  completedTasks: string[];
  ticketToTaskMap: Record<string, string>;
  queuedTicketIds: string[];
  agents: Agent[];
}
