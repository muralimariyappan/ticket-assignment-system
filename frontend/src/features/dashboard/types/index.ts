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

export interface QueuedTicket {
  priority: number;
  position: number;
  ticketId: string;
  platform: string;
  restrictions: string[];
  isVoice: boolean;
  createdAt: number;
}

export interface QueueData {
  voice: QueuedTicket[];
  text: QueuedTicket[];
  total: number;
}
