export interface Task {
  id: string;
  platform: string;
}

export interface Agent {
  id: string;
  name: string;
  languageSkills: string[];
  assignedTasks: Task[];
}

export type NewAgentPayload = Pick<Agent, 'name' | 'languageSkills'>;
export type UpdateAgentPayload = Pick<Agent, 'languageSkills'> & {
  addSkills: string[];
  removeSkills: string[];
};
