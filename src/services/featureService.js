import apiService from './api/apiService'

class FeatureService {
  async getAll() {
    return apiService.get('/api/features', { requiresAuth: true })
  }

  async getById(id) {
    return apiService.get(`/api/features/${id}`, { requiresAuth: true })
  }

  async create(featureData) {
    return apiService.post('/api/features', featureData, { requiresAuth: true })
  }

  async update(id, featureData) {
    return apiService.put(`/api/features/${id}`, featureData, { requiresAuth: true })
  }

  async delete(id) {
    return apiService.delete(`/api/features/${id}`, { requiresAuth: true })
  }

  async getByCustomer(customerId) {
    return apiService.get(`/api/features?customerId=${customerId}`, { requiresAuth: true })
  }

  async getByProduct(productId) {
    return apiService.get(`/api/features?productId=${productId}`, { requiresAuth: true })
  }
}

export default new FeatureService()