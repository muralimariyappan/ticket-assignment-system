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
