import { toast } from 'sonner';
import { OFFER_NAME } from '@/constants/offer';

/** Web Share with clipboard fallback, mirroring the prototype's share action. */
export async function shareOffer(): Promise<void> {
  const message = `I just subscribed to the ${OFFER_NAME} IPO on Vetiva 🚀 Offer closes 31 Jul — get in: https://vetiva.demo/dprp`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Dangote IPO on Vetiva', text: message });
      return;
    } catch {
      // user dismissed the sheet — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(message);
    toast('Share link copied — WhatsApp-ready with rich preview [DEMO]');
  } catch {
    toast('Sharing is not available in this browser');
  }
}
