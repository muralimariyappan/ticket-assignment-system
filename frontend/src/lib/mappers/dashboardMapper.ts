import { DashboardData, Agent } from '@/features/dashboard/types';
import { RawDashboardResponse } from '@/features/dashboard/types/raw';

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
