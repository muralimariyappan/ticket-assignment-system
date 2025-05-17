import { toast } from 'sonner';

export function showErrorToast(error: unknown) {
  toast.error('Something went wrong', {
    description: error instanceof Error ? error.message : String(error),
    duration: 5000,
    action: {
      label: 'Close',
      onClick: () => {},
    },
  });
}
