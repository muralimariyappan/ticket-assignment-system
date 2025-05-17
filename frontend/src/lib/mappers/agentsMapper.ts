import {
  Agent,
  Task,
  NewAgentPayload,
  UpdateAgentPayload,
} from '@/features/agents/types';

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

export interface RawUpdateAgentPayload {
  language_skills: string[];
  add_skills: string[];
  remove_skills: string[];
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

export function mapNewAgentPayload(
  agent: NewAgentPayload
): Pick<AgentResponse, 'name' | 'language_skills'> {
  return {
    name: agent.name,
    language_skills: agent.languageSkills,
  };
}

export function mapUpdateAgentPayload(
  updatePayload: UpdateAgentPayload
): RawUpdateAgentPayload {
  return {
    language_skills: updatePayload.languageSkills,
    add_skills: updatePayload.addSkills,
    remove_skills: updatePayload.removeSkills,
  };
}
