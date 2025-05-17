'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select'; // Assuming you built this already
import { useAssignTicket } from './hooks/useAssignTicket';
import { LANGUAGE_OPTIONS } from '@/constants/languages';
import { PLATFORM_OPTIONS } from '@/constants/workload';
import { showErrorToast, showSuccessToast } from '@/lib/utils/show-toast';

export function AssignTicket() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [platform, setPlatform] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { assignTicket, isLoading } = useAssignTicket();

  const handleSubmit = async () => {
    if (!platform) {
      setErrorMsg('Platform is required');
      return;
    }

    try {
      await assignTicket({ id, restrictions, platform });
      showSuccessToast('Ticket assigned successfully');
      setOpen(false);
      setId('');
      setRestrictions([]);
      setPlatform('');
      // Can be replaced with a more specific refresh if needed
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Failed to assign ticket');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Assign Ticket</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Ticket</DialogTitle>
          <DialogDescription>
            Fill the following fields to assign a ticket.
          </DialogDescription>
        </DialogHeader>
        {errorMsg && (
          <div className="text-red-500 text-sm mb-2">{errorMsg}</div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="pb-2" htmlFor="id">
              Ticket ID
            </Label>
            <Input id="id" value={id} onChange={(e) => setId(e.target.value)} />
          </div>

          <div>
            <Label className="pb-2">Restrictions</Label>
            <MultiSelect
              options={LANGUAGE_OPTIONS}
              selected={restrictions}
              onChange={setRestrictions}
              placeholder="Select restrictions"
            />
          </div>

          <div>
            <Label className="pb-2">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
