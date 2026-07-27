import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('trustfundx_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('trustfundx_token');
      localStorage.removeItem('trustfundx_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  campaigns: {
    getAll: (params?: any) => apiClient.get('/api/campaigns', { params }),
    getFeatured: () => apiClient.get('/api/campaigns/featured'),
    getOne: (idOrSlug: string) => apiClient.get(`/api/campaigns/${idOrSlug}`),
    getDonations: (id: string, params?: any) => apiClient.get(`/api/campaigns/${id}/donations`, { params }),
    getStats: () => apiClient.get('/api/campaigns/stats'),
  },
  donations: {
    initiate: (data: any) => apiClient.post('/api/donations/initiate', data),
    verify: (data: any) => apiClient.post('/api/donations/verify', data),
    getByTxId: (txId: string) => apiClient.get(`/api/donations/tx/${txId}`),
    getMy: () => apiClient.get('/api/donations/my'),
  },
  auth: {
    register: (data: any) => apiClient.post('/api/auth/register', data),
    login: (data: any) => apiClient.post('/api/auth/login', data),
    me: () => apiClient.get('/api/auth/me'),
    updateProfile: (data: any) => apiClient.put('/api/auth/me', data),
    connectWallet: (walletAddress: string) => apiClient.post('/api/auth/connect-wallet', { walletAddress }),
    forgotPassword: (email: string) => apiClient.post('/api/auth/forgot-password', { email }),
    resetPassword: (data: any) => apiClient.post('/api/auth/reset-password', data),
    verifyEmail: (token: string) => apiClient.get(`/api/auth/verify-email?token=${token}`),
  },
  admin: {
    getStats: () => apiClient.get('/api/admin/stats'),
    campaigns: {
      getAll: (params?: any) => apiClient.get('/api/admin/campaigns', { params }),
      getOne: (id: string) => apiClient.get(`/api/admin/campaigns/${id}`),
      create: (data: FormData) => apiClient.post('/api/admin/campaigns', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
      update: (id: string, data: any) => apiClient.put(`/api/admin/campaigns/${id}`, data),
      delete: (id: string) => apiClient.delete(`/api/admin/campaigns/${id}`),
      updateStatus: (id: string, data: any) => apiClient.patch(`/api/admin/campaigns/${id}/status`, data),
      triggerAi: (id: string) => apiClient.post(`/api/admin/campaigns/${id}/ai-verify`),
      export: (id: string) => apiClient.get(`/api/admin/campaigns/${id}/export`, { responseType: 'blob' }),
    },
    donations: {
      getAll: (params?: any) => apiClient.get('/api/admin/donations', { params }),
      getOne: (id: string) => apiClient.get(`/api/admin/donations/${id}`),
    },
    analytics: {
      daily: (params?: any) => apiClient.get('/api/admin/analytics/daily-donations', { params }),
      monthly: (params?: any) => apiClient.get('/api/admin/analytics/monthly-donations', { params }),
      countryWise: () => apiClient.get('/api/admin/analytics/country-wise'),
      categories: () => apiClient.get('/api/admin/analytics/disaster-categories'),
      success: () => apiClient.get('/api/admin/analytics/campaign-success'),
      trends: () => apiClient.get('/api/admin/analytics/donation-trends'),
    },
    ai: {
      getAlerts: (params?: any) => apiClient.get('/api/admin/ai/alerts', { params }),
      getAnalyses: () => apiClient.get('/api/admin/ai/analyses'),
      resolveAlert: (id: string) => apiClient.patch(`/api/admin/ai/alerts/${id}/resolve`),
      analyzeOne: (id: string) => apiClient.post(`/api/admin/ai/analyze/${id}`),
      analyzeAll: () => apiClient.post('/api/admin/ai/analyze-all'),
    },
    settings: {
      get: () => apiClient.get('/api/admin/settings'),
      update: (data: any) => apiClient.put('/api/admin/settings', data),
      changePassword: (data: any) => apiClient.post('/api/admin/settings/change-password', data),
      getAuditLogs: (params?: any) => apiClient.get('/api/admin/settings/audit-logs', { params }),
    },
    users: {
      getAll: (params?: any) => apiClient.get('/api/admin/users', { params }),
    },
  },
};
