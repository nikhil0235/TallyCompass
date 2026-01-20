import apiService from './api/apiService'

class AuthService {
  async login(credentials) {
    const response = await apiService.post('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  async signup(userData) {
    const response = await apiService.post('/auth/signup', userData)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  async forgotPassword(email) {
    return apiService.post('/auth/forgot-password', email)
  }

  async resetPassword(data) {
    return apiService.post('/auth/reset-password', data)
  }

  async logout() {
    try {
      await apiService.post('/auth/logout', {}, { requiresAuth: true })
    } finally {
      localStorage.removeItem('token')
    }
  }

  async getCurrentUser() {
    return apiService.get('/auth/me', { requiresAuth: true })
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

export default new AuthService()