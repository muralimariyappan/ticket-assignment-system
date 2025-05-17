'use client';

import { Button } from '@/components/ui/button';
import { resetSystem } from '@/lib/api/dashboard';
import { DashboardData } from '../types';
import { WORKLOAD_TYPES } from '@/constants/workload';
import { countAssignedTasksByPlatform } from '@/features/dashboard/utils';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Props {
  data: DashboardData | null;
  loading: boolean;
  error?: string | null;
}

export function SystemStatus({ data, loading, error }: Props) {
  const [open, setOpen] = useState(false);
  const handleReset = async () => {
    await resetSystem();
    window.location.reload();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">No data available</div>;

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">System Status</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button onClick={() => setOpen(true)} variant="destructive">
          Reset System
        </Button>
        <ConfirmDialog
          open={open}
          setOpen={setOpen}
          title="Reset System"
          description="Are you sure you want to reset the system? This action cannot be undone."
          confirmText="Reset"
          cancelText="Cancel"
          onConfirm={handleReset}
        />
      </div>
      <div className="flex items-center justify-between gap-6 mt-2">
        <div>
          <strong>
            {countAssignedTasksByPlatform(data.agents, WORKLOAD_TYPES.CALL)}
          </strong>{' '}
          Active Calls
        </div>
        <div>
          <strong>
            {countAssignedTasksByPlatform(data.agents, WORKLOAD_TYPES.CALL, {
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
