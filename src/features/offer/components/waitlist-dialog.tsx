import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SegmentedControl } from '@/components/common/segmented-control';
import { useJoinWaitlist } from '@/features/offer/api';
import { apiErrorMessage } from '@/lib/axios';
import { OFFER_ID } from '@/constants/offer';

export function WaitlistDialog() {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const join = useJoinWaitlist();

  function submit() {
    join.mutate(
      { offerId: OFFER_ID, channel },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success(
            "You're on the list — we'll deep-link you straight into the offer when it opens.",
          );
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="mt-4">
          Join the waiting list
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Join the waiting list"
        description="How would you like to be notified the moment the offer opens?"
      >
        <SegmentedControl
          aria-label="Notification channel"
          value={channel}
          onChange={setChannel}
          className="mt-4"
          options={[
            {
              value: 'email',
              label: (
                <>
                  <Mail className="size-4" aria-hidden /> Email
                </>
              ),
            },
            {
              value: 'whatsapp',
              label: (
                <>
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </>
              ),
            },
          ]}
        />
        <Button size="lg" className="mt-5" onClick={submit} loading={join.isPending}>
          Notify me
        </Button>
      </DialogContent>
    </Dialog>
  );
}
