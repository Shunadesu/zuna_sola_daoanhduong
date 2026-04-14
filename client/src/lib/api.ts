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

export const contactApi = {
  getActive: () => api.get('/api/contacts'),
};

export const quoteApi = {
  submit: (data: QuoteFormData) => api.post('/api/quotes', data),
};

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
}

export default api;
