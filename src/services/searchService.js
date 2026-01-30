import apiService from './api/apiService'

class SearchService {
  async query(searchQuery) {
    return apiService.post('/api/search/query', { query: searchQuery }, { requiresAuth: true })
  }

  async getSearchHistory() {
    return apiService.get('/api/search/history', { requiresAuth: true })
  }
}

export default new SearchService()