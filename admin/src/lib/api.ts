import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
  verify: () => api.post('/api/auth/verify'),
  me: () => api.get('/api/auth/me'),
};

// Banner API - Public
export const bannerPublicApi = {
  getActive: () => api.get('/api/banners'),
};

// Banner API - Admin
export const bannerApi = {
  getAll: () => api.get('/api/admin/banners'),
  create: (data: BannerFormData) => api.post('/api/admin/banners', data),
  update: (id: string, data: BannerFormData) => api.put(`/api/admin/banners/${id}`, data),
  delete: (id: string) => api.delete(`/api/admin/banners/${id}`),
};

// Quote API - Public
export const quotePublicApi = {
  submit: (data: QuoteFormData) => api.post('/api/quotes', data),
};

// Quote API - Admin
export const quoteApi = {
  getAll: () => api.get('/api/admin/quotes'),
  getStats: () => api.get('/api/admin/quotes/stats'),
  updateStatus: (id: string, status: string) =>
    api.put(`/api/admin/quotes/${id}`, { status }),
};

// Contact API - Public
export const contactPublicApi = {
  getActive: () => api.get('/api/contacts'),
};

// Contact API - Admin
export const contactApi = {
  getAll: () => api.get('/api/admin/contacts'),
  create: (data: ContactFormData) => api.post('/api/admin/contacts', data),
  update: (id: string, data: ContactFormData) => api.put(`/api/admin/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/api/admin/contacts/${id}`),
};

// Stats API
export const statsApi = {
  getDashboard: () => api.get('/api/admin/stats'),
  getDaily: () => api.get('/api/admin/stats/daily'),
  getQuoteStatus: () => api.get('/api/admin/stats/quote-status'),
};

// Types
export interface BannerFormData {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
}

export interface ContactFormData {
  type: 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'quote';
  label: string;
  value: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export default api;
