import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { LANGUAGE_OPTIONS } from '@/constants/languages';
import { useState } from 'react';

interface AgentInputDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  languages: string[];
  setLanguages: (languages: string[]) => void;
  isEditing?: boolean;
  handleAddAgent: () => void;
}

function AgentInputDialog({
  open,
  setOpen,
  name,
  setName,
  languages,
  setLanguages,
  isEditing,
  handleAddAgent,
}: AgentInputDialogProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg('Name is required');
      return;
    }
    handleAddAgent();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edit the agent details below.'
              : 'Fill in the details to create a new agent.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="pb-2">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isEditing}
            />
          </div>
          <div>
            <Label className="pb-2">Languages</Label>
            <MultiSelect
              options={LANGUAGE_OPTIONS}
              selected={languages}
              onChange={setLanguages}
            />
          </div>
          {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AgentInputDialog;
