import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Agent } from '../types';
import { WORKlOAD_TYPES } from '@/constants/workload';

interface AgentWorkloadItemProps {
  agent: Agent;
}

type Status = 'Available' | 'Busy';

const AgentWorkloadItem: React.FC<AgentWorkloadItemProps> = ({
  agent,
}: AgentWorkloadItemProps) => {
  const MAX_CHAT_TASKS_CAPACITY = 3;
  const MAX_CALL_TASKS_CAPACITY = 1;

  const languageSkillsCount = agent.languageSkills.length;

  let workloadPercent = 0;

  const callsAssignedCount = agent.assignedTasks.filter(
    (task) => task.platform === WORKlOAD_TYPES.CALL
  ).length;

  const chatsAssignedCount = agent.assignedTasks.filter(
    (task) => task.platform === WORKlOAD_TYPES.CHAT
  ).length;

  if (callsAssignedCount > 0) {
    workloadPercent =
      (callsAssignedCount / MAX_CALL_TASKS_CAPACITY) * 100 +
      (chatsAssignedCount / MAX_CHAT_TASKS_CAPACITY) * 100;
  } else {
    workloadPercent = (chatsAssignedCount / MAX_CHAT_TASKS_CAPACITY) * 100;
  }

  const statusColor = {
    Available: 'text-green-600',
    Busy: 'text-yellow-600',
  };

  const status: Status = workloadPercent === 100 ? 'Busy' : 'Available';

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <span className={`${statusColor[status]} font-medium`}>{status}</span>
      </div>

      <p className="mb-2 text-sm text-muted-foreground">
        {languageSkillsCount} languages
      </p>

      <Progress value={workloadPercent} className="h-3 rounded-full" />
    </div>
  );
};

export default AgentWorkloadItem;
