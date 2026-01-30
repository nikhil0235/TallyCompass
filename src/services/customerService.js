import apiService from './api/apiService'

class CustomerService {
  async getAll() {
    return apiService.get('/api/customers', { requiresAuth: true })
  }

  async getById(id) {
    return apiService.get(`/api/customers/${id}`, { requiresAuth: true })
  }

  async create(customerData) {
    // Ensure proper data structure for customer schema
    const formattedData = {
      contactPersonName: customerData.contactPersonName,
      companyName: customerData.companyName,
      contactNo: customerData.contactNo,
      businessType: customerData.businessType,
      planType: customerData.planType,
      accountStatus: customerData.accountStatus || 'inactive',
      customerProficiency: customerData.customerProficiency || 'beginner',
      companyDataURL: customerData.companyDataURL,
      location: {
        country: customerData.location?.country || customerData.country,
        state: customerData.location?.state || customerData.state
      },
      ...customerData
    }
    return apiService.post('/api/customers', formattedData, { requiresAuth: true })
  }

  async update(id, customerData) {
    // Ensure proper data structure for customer schema
    const formattedData = {
      contactPersonName: customerData.contactPersonName,
      companyName: customerData.companyName,
      contactNo: customerData.contactNo,
      businessType: customerData.businessType,
      planType: customerData.planType,
      accountStatus: customerData.accountStatus,
      customerProficiency: customerData.customerProficiency,
      companyDataURL: customerData.companyDataURL,
      location: {
        country: customerData.location?.country || customerData.country,
        state: customerData.location?.state || customerData.state
      },
      ...customerData
    }
    return apiService.put(`/api/customers/${id}`, formattedData, { requiresAuth: true })
  }

  async delete(id) {
    return apiService.delete(`/api/customers/${id}`, { requiresAuth: true })
  }

  async getByProduct(productId) {
    return apiService.get(`/api/customers?productId=${productId}`, { requiresAuth: true })
  }

  async getByStatus(status) {
    return apiService.get(`/api/customers?accountStatus=${status}`, { requiresAuth: true })
  }

  async getByProficiency(proficiency) {
    return apiService.get(`/api/customers?customerProficiency=${proficiency}`, { requiresAuth: true })
  }
}

export default new CustomerService()