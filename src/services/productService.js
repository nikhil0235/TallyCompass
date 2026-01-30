import apiService from './api/apiService'

class ProductService {
  async getAll() {
    return apiService.get('/api/products', { requiresAuth: true })
  }

  async getById(id) {
    return apiService.get(`/api/products/${id}`, { requiresAuth: true })
  }

  async create(productData) {
    return apiService.post('/api/products', productData, { requiresAuth: true })
  }

  async update(id, productData) {
    return apiService.put(`/api/products/${id}`, productData, { requiresAuth: true })
  }

  async delete(id) {
    return apiService.delete(`/api/products/${id}`, { requiresAuth: true })
  }
}

export default new ProductService()