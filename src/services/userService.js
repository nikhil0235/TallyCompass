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
    console.log('Calling API: /api/users/get-all-userr')
    const response = await apiService.get('/api/users/get-all-userr', { requiresAuth: true })
    console.log('API Response:', response)
    return response
  }

  async sendAttachedUsers(attachedUsers) {
    return apiService.post('/api/users/attached', { attachedUsers }, { requiresAuth: true })
  }
}

export default new UserService()