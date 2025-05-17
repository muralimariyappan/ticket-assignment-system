import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';

interface AgentInputDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  languages: string[];
  setLanguages: (languages: string[]) => void;
  handleAddAgent: () => void;
}

function AgentInputDialog({
  open,
  setOpen,
  name,
  setName,
  languages,
  setLanguages,
  handleAddAgent,
}: AgentInputDialogProps) {
  const supportedLanguages = [
    'English',
    'German',
    'Spanish',
    'French',
    'Italian',
    'Portuguese',
    'Dutch',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Languages</Label>
            <MultiSelect
              options={supportedLanguages}
              selected={languages}
              onChange={setLanguages}
            />
          </div>
          <Button onClick={handleAddAgent}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AgentInputDialog;
