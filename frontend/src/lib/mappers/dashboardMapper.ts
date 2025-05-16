import { DashboardData, Agent } from '@/features/dashboard/types';

export interface RawDashboardResponse {
  assigned_ticket_ids: string[];
  completed_tasks: string[];
  ticket_to_task_map: Record<string, string>;
  queued_ticket_ids: string[];
  agents: Record<
    string,
    {
      language_skills: string[];
      assigned_tasks: {
        id: string;
        platform: string;
      }[];
    }
  >;
}

export function mapDashboardResponse(
  response: RawDashboardResponse
): DashboardData {
  const agents: Agent[] = Object.entries(response.agents || {}).map(
    ([id, data]) => ({
      id,
      languageSkills: data.language_skills,
      assignedTasks: data.assigned_tasks.map((task) => ({
        id: task.id,
        platform: task.platform,
      })),
    })
  );

  return {
    assignedTicketIds: response.assigned_ticket_ids ?? [],
    completedTasks: response.completed_tasks ?? [],
    ticketToTaskMap: response.ticket_to_task_map ?? {},
    queuedTicketIds: response.queued_ticket_ids ?? [],
    agents,
  };
}
