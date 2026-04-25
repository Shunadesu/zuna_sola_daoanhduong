import { create } from 'zustand';
import { quoteApi, QuoteFormData } from '@/lib/api';
import { emailService } from '@/services/emailService';

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
      // Submit to API
      await quoteApi.submit(data);

      // Send notification email via EmailJS
      await emailService.sendNotification({
        to_name: 'Sola Global City Team',
        to_email: 'thanhpham.02092002@gmail.com',
        from_name: data.fullName,
        from_phone: data.phone,
        from_email: data.email,
        apartment: data.apartment,
        message: `Yêu cầu tư vấn từ ${data.fullName} - SĐT: ${data.phone}`,
        source: 'contact_form',
      });

      // Send confirmation email if customer provided email
      if (data.email) {
        await emailService.sendConfirmation(data.email, data.fullName);
      }

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
