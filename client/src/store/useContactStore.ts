import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { contactApi } from '@/lib/api';

export type ContactType = 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'quote';

export interface Contact {
  _id: string;
  type: ContactType;
  label: string;
  value: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

interface ContactState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set) => ({
      contacts: [],
      isLoading: false,
      error: null,

      fetchContacts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await contactApi.getActive();
          set({ contacts: response.data.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch contacts', isLoading: false });
          console.error('Failed to fetch contacts:', error);
        }
      },
    }),
    {
      name: 'sola-contacts',
      partialize: (state) => ({ contacts: state.contacts }),
    }
  )
);
