import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bannerApi = {
  getActive: () => api.get('/api/banners'),
};

export const overviewApi = {
  getActive: () => api.get('/api/overviews'),
};

export const amenityApi = {
  getActive: () => api.get('/api/amenities'),
};

export const galleryApi = {
  getActive: (category?: string) =>
    api.get('/api/galleries', { params: category ? { category } : {} }),
};

export const contactApi = {
  getActive: () => api.get('/api/contacts'),
  getByType: (type: string) => api.get(`/api/contacts?type=${type}`),
  create: (data: { type: string; label: string; value: string; icon?: string; isActive?: boolean; sortOrder?: number }) =>
    api.post('/api/contacts', data),
  update: (id: string, data: Partial<{ type: string; label: string; value: string; icon: string; isActive: boolean; sortOrder: number }>) =>
    api.put(`/api/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/api/contacts/${id}`),
};

export const quoteApi = {
  submit: (data: QuoteFormData) => api.post('/api/quotes', data),
};

export const trackApi = {
  pageview: (page: string, referrer?: string) =>
    api.post('/api/track/pageview', { page, referrer }),
};

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface Contact {
  _id: string;
  type: 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'email' | 'address' | 'quote';
  label: string;
  value: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface Gallery {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export default api;
