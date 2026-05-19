import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  demoLogin: () => api.post('/auth/demo-login'),
  me: () => api.get('/auth/me'),
};

// Resumes
export const resumeApi = {
  upload: (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return api.post('/resumes/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  list: () => api.get('/resumes'),
  get: (id: number) => api.get(`/resumes/${id}`),
};

// Jobs
export const jobApi = {
  create: (data: { company_name?: string; role_title?: string; description: string }) => api.post('/jobs', data),
  list: () => api.get('/jobs'),
  get: (id: number) => api.get(`/jobs/${id}`),
};

// Analysis
export const analysisApi = {
  run: (data: {
    resume_id?: number; job_description_id?: number;
    resume_text?: string; job_description_text?: string;
    company_name?: string; role_title?: string;
  }) => api.post('/analysis/run', data),
  list: () => api.get('/analysis'),
  get: (id: number) => api.get(`/analysis/${id}`),
  getInterviewQuestions: (id: number) => api.get(`/analysis/${id}/interview-questions`),
  getProjects: (id: number) => api.get(`/analysis/${id}/projects`),
};

// Companies
export const companyApi = {
  list: () => api.get('/companies'),
  get: (name: string) => api.get(`/companies/${name}`),
};

// Dashboard
export const dashboardApi = {
  summary: () => api.get('/dashboard/summary'),
  activity: () => api.get('/dashboard/activity'),
  charts: () => api.get('/dashboard/charts'),
};

// Admin
export const adminApi = {
  metrics: () => api.get('/admin/metrics'),
  users: () => api.get('/admin/users'),
  analyses: () => api.get('/admin/analyses'),
};
