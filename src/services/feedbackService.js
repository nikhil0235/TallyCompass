import apiService from './api/apiService'

class FeedbackService {
  async getAll() {
    return apiService.get('/api/feedback', { requiresAuth: true })
  }

  async getById(id) {
    return apiService.get(`/api/feedback/${id}`, { requiresAuth: true })
  }

  async create(feedbackData) {
    return apiService.post('/api/feedback', feedbackData, { requiresAuth: true })
  }

  async update(id, feedbackData) {
    return apiService.put(`/api/feedback/${id}`, feedbackData, { requiresAuth: true })
  }

  async delete(id) {
    return apiService.delete(`/api/feedback/${id}`, { requiresAuth: true })
  }

  async getByCustomer(customerId) {
    return apiService.get(`/api/feedback?customerId=${customerId}`, { requiresAuth: true })
  }

  async getByProduct(productId) {
    return apiService.get(`/api/feedback?productId=${productId}`, { requiresAuth: true })
  }
}

export default new FeedbackService()