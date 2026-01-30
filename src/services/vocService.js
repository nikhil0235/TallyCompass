import apiService from './api/apiService'

const vocService = {
  getAll: () => apiService.get('/api/voc', { requiresAuth: true }),
  getById: (id) => apiService.get(`/api/voc/${id}`, { requiresAuth: true }),
  create: (data) => apiService.post('/api/voc', data, { requiresAuth: true }),
  update: (id, data) => apiService.put(`/api/voc/${id}`, data, { requiresAuth: true }),
  delete: (id) => apiService.delete(`/voc/${id}`, { requiresAuth: true })
}

export default vocService