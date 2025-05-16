import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Agent } from '../types';
import { getCallsAssignedCount, getChatsAssignedCount } from '../utils';

interface AgentWorkloadItemProps {
  agent: Agent;
}

type Status = 'Available' | 'Busy';

const AgentWorkloadItem: React.FC<AgentWorkloadItemProps> = ({
  agent,
}: AgentWorkloadItemProps) => {
  const languageSkillsCount = agent.languageSkills.length;

  const getWorkloadPercent = (agent: Agent) => {
    const callsAssignedCount = getCallsAssignedCount(agent);
    const chatsAssignedCount = getChatsAssignedCount(agent);
    const MAX_CAPACITY_WITH_CALL = 3;
    const MAX_CAPACITY_WITHOUT_CALL = 4;
    if (callsAssignedCount > 0) {
      return (
        ((callsAssignedCount + chatsAssignedCount) / MAX_CAPACITY_WITH_CALL) *
        100
      );
    } else {
      return (chatsAssignedCount / MAX_CAPACITY_WITHOUT_CALL) * 100;
    }
  };

  const statusColor = {
    Available: 'text-green-600',
    Busy: 'text-yellow-600',
  };

  const workloadPercent = getWorkloadPercent(agent);

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
