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
