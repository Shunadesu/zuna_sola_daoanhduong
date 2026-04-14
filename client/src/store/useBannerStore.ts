import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { bannerApi } from '@/lib/api';

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  fetchBanners: () => Promise<void>;
}

export const useBannerStore = create<BannerState>()(
  persist(
    (set) => ({
      banners: [],
      isLoading: false,
      error: null,

      fetchBanners: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await bannerApi.getActive();
          set({ banners: response.data.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch banners', isLoading: false });
          console.error('Failed to fetch banners:', error);
        }
      },
    }),
    {
      name: 'sola-banners',
      partialize: (state) => ({ banners: state.banners }),
    }
  )
);
