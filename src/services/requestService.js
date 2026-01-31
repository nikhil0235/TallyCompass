// src/services/requestService.js
import axios from 'axios';

const API_BASE = '/api/requests';

const requestService = {
  async getRequestById(id) {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  },
  // Add more request-related API methods as needed
};

export default requestService;
