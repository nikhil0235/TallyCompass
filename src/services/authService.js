import apiService from './api/apiService'

class AuthService {
  async login(credentials) {
    const response = await apiService.post('/api/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  async signup(userData) {
    const response = await apiService.post('/api/auth/signup', userData)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  async forgotPassword(email) {
    return apiService.post('/api/auth/forgot-password', email)
  }

  async resetPassword(data) {
    return apiService.post('/api/auth/reset-password', data)
  }

  logout() {
    localStorage.removeItem('token')
  }

  async getCurrentUser() {
    return apiService.get('/api/auth/me', { requiresAuth: true })
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

export default new AuthService()