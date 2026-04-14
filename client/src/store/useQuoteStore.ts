import { create } from 'zustand';
import { quoteApi, QuoteFormData } from '@/lib/api';

interface QuoteState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  submitQuote: (data: QuoteFormData) => Promise<boolean>;
  reset: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  isSubmitting: false,
  isSubmitted: false,
  error: null,

  submitQuote: async (data: QuoteFormData) => {
    set({ isSubmitting: true, error: null });
    try {
      await quoteApi.submit(data);
      set({ isSubmitting: false, isSubmitted: true });
      return true;
    } catch (error) {
      set({ error: 'Failed to submit quote', isSubmitting: false });
      console.error('Failed to submit quote:', error);
      return false;
    }
  },

  reset: () => {
    set({ isSubmitting: false, isSubmitted: false, error: null });
  },
}));
