import { Button } from '@/components/ui/button';
import { Task } from '../types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onClose: () => void;
}

export function TaskItem({ task, onClose }: TaskItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-between items-center bg-muted rounded px-3 py-1">
      <div className="text-sm font-medium capitalize">{task.platform}</div>
      <Button variant="default" onClick={() => setOpen(true)}>
        Close Task
      </Button>
      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        title="Close Task"
        description="Are you sure you want to close this task?"
        confirmText="Close"
        cancelText="Cancel"
        onConfirm={onClose}
      />
    </div>
  );
}
