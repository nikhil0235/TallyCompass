import apiService from './api/apiService'

export const getDashboardStats = async () => {
  const response = await apiService.get('/dashboard')
  return response.data
}