import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const goalsAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

export const routinesAPI = {
  getAll: (goalId) => api.get('/routines', { params: { goalId } }),
  create: (data) => api.post('/routines', data),
  update: (id, data) => api.put(`/routines/${id}`, data),
  delete: (id) => api.delete(`/routines/${id}`),
};

export const logsAPI = {
  getByDate: (date) => api.get(`/logs/${date}`),
  getRange: (start, end, goalId) => api.get('/logs', { params: { start, end, goalId } }),
  save: (date, data) => api.post(`/logs/${date}`, data),
  getGrowthStats: (days, goalId) => api.get('/logs/stats/growth', { params: { days, goalId } }),
};

export default api;
