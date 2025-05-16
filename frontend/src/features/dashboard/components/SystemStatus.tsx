'use client';

import { Button } from '@/components/ui/button';
import { resetSystem } from '@/lib/api/dashboard';
import { Agent, DashboardData } from '../types';

interface Props {
  data: DashboardData | null;
  loading: boolean;
}

export function SystemStatus({ data, loading }: Props) {
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">No data available</div>;

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">System Status</h2>
        <Button onClick={handleReset} variant="outline">
          Reset System
        </Button>
      </div>
      <div className="flex items-center justify-between gap-6 mt-2">
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
  );
}
