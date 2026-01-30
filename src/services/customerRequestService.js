import apiService from './api/apiService'

class CustomerRequestService {
  transformRequest(apiRequest) {
    try {
      return {
        id: apiRequest._id,
        title: apiRequest.requestTitle || 'Untitled Request',
        description: apiRequest.description || 'No description',
        type: apiRequest.requestType || 'issue',
        status: apiRequest.action?.status || 'pending',
        priority: apiRequest.priority || 'medium',
        customerList: apiRequest.customterList || [],
        productId: apiRequest.productId,
        customerName: 'Multiple Customers',
        createdAt: apiRequest.createdAt || new Date().toISOString(),
        updatedAt: apiRequest.updatedAt || new Date().toISOString(),
        actionDescription: apiRequest.action?.description
      }
    } catch (error) {
      console.error('Error transforming request:', error, apiRequest)
      return {
        id: apiRequest._id || 'unknown',
        title: 'Error loading request',
        description: 'Failed to load request data',
        type: 'issue',
        status: 'pending',
        priority: 'medium',
        customerList: [],
        productId: null,
        customerName: 'Unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  async getAll() {
    try {
      console.log('Fetching customer requests...')
      const response = await apiService.get('/api/customer-requests', { requiresAuth: true })
      console.log('Raw API response:', response)
      const transformed = Array.isArray(response) ? response.map(req => this.transformRequest(req)) : []
      console.log('Transformed requests:', transformed)
      return transformed
    } catch (error) {
      console.error('Error fetching requests:', error)
      throw error
    }
  }

  async getById(id) {
    const response = await apiService.get(`/api/customer-requests/${id}`, { requiresAuth: true })
    return this.transformRequest(response)
  }

  async create(requestData) {
    const response = await apiService.post('/api/customer-requests', requestData, { requiresAuth: true })
    return this.transformRequest(response)
  }

  async update(id, requestData) {
    const response = await apiService.put(`/api/customer-requests/${id}`, requestData, { requiresAuth: true })
    return this.transformRequest(response)
  }

  async delete(id) {
    return apiService.delete(`/api/customer-requests/${id}`, { requiresAuth: true })
  }

  async getByCustomer(customerId) {
    const response = await apiService.get(`/api/customer-requests?customerId=${customerId}`, { requiresAuth: true })
    return Array.isArray(response) ? response.map(req => this.transformRequest(req)) : []
  }

  async updateStatus(id, status) {
    const updateData = {
      action: {
        status: status,
        description: `Status updated to ${status}`
      }
    }
    const response = await apiService.put(`/api/customer-requests/${id}`, updateData, { requiresAuth: true })
    return this.transformRequest(response)
  }
}

export default new CustomerRequestService()