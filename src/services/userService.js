import apiService from './api/apiService'

class UserService {
  async getProfile() {
    return apiService.get('/api/users/profile', { requiresAuth: true })
  }

  async updateProfile(userData) {
    return apiService.put('/api/users/profile', userData, { requiresAuth: true })
  }

  async uploadProfilePicture(formData) {
    return apiService.request('/api/users/profile/picture', {
      method: 'POST',
      body: formData,
      requiresAuth: true,
      headers: {} // Remove Content-Type to let browser set it for FormData
    })
  }

  async changePassword(passwordData) {
    return apiService.put('/api/users/change-password', passwordData, { requiresAuth: true })
  }

  async getAll() {
    return apiService.get('/api/users', { requiresAuth: true })
  }
}

export default new UserService()