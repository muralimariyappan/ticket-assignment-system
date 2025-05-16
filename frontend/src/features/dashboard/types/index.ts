export interface Task {
  id: string;
  platform: string;
}

export interface Agent {
  id: string;
  languageSkills: string[];
  assignedTasks: Task[];
}

export interface DashboardData {
  assignedTicketIds: string[];
  completedTasks: string[];
  ticketToTaskMap: Record<string, string>;
  queuedTicketIds: string[];
  agents: Agent[];
}
