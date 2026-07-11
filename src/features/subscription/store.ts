import { create } from 'zustand';
import type { Order } from '@/types/domain';

/** Holds the just-completed order for the success page (memory only). */
interface OrderState {
  lastOrder: Order | null;
  setOrder: (order: Order) => void;
  clear: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  lastOrder: null,
  setOrder: (order) => set({ lastOrder: order }),
  clear: () => set({ lastOrder: null }),
}));
