'use client';

import { Button } from '@/components/ui/button';
import { resetSystem } from '@/lib/api/dashboard';
import { Agent, DashboardData } from '../types';

interface Props {
  data: DashboardData;
}

export function SystemStatus({ data }: Props) {
  console.log('SystemStatus data:', data);
  const handleReset = async () => {
    await resetSystem();
    window.location.reload();
  };

  const countAssignedTasksByPlatform = (
    agents: Agent[],
    platform: string,
    options?: { exclude?: boolean }
  ): number => {
    return Object.values(agents).reduce((total, agent) => {
      const filteredTasks = agent.assignedTasks.filter((task) =>
        options?.exclude
          ? task.platform !== platform
          : task.platform === platform
      );
      return total + filteredTasks.length;
    }, 0);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">System Status</h2>
        <div className="flex gap-6 mt-2">
          <div>
            <strong>{countAssignedTasksByPlatform(data.agents, 'call')}</strong>{' '}
            Active Calls
          </div>
          <div>
            <strong>
              {countAssignedTasksByPlatform(data.agents, 'call', {
                exclude: true,
              })}
            </strong>{' '}
            Active Messages
          </div>
          <div>
            <strong>{data.completedTasks.length}</strong> Completed Tasks
          </div>
        </div>
      </div>
      <Button onClick={handleReset} variant="outline">
        Reset System
      </Button>
    </div>
  );
}
