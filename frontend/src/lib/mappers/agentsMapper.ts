import { Agent, Task } from '@/features/agents/types';

export interface TaskResponse {
  id: string;
  platform: string;
}

export interface AgentResponse {
  id: string;
  name: string;
  language_skills: string[];
  assigned_tasks: Task[];
}

export function mapTask(task: TaskResponse): Task {
  return {
    id: task.id,
    platform: task.platform,
  };
}

export function mapAgent(agent: AgentResponse): Agent {
  return {
    id: agent.id,
    name: agent.name,
    languageSkills: agent.language_skills,
    assignedTasks: agent.assigned_tasks.map(mapTask),
  };
}

export function mapAgents(agents: AgentResponse[]): Agent[] {
  return agents.map(mapAgent);
}
