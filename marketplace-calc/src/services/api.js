import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions for calculator operations
export const calculatorApi = {
  // Save calculation to the database
  saveCalculation: async (calculationData) => {
    try {
      const response = await api.post('/calc/save', calculationData);
      return response.data;
    } catch (error) {
      console.error('Error saving calculation:', error);
      throw error;
    }
  },

  // Get user's calculation history
  getCalculationHistory: async (userId) => {
    try {
      const response = await api.get(`/calc/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calculation history:', error);
      throw error;
    }
  },

  // Get a specific calculation by ID
  getCalculationById: async (calculationId) => {
    try {
      const response = await api.get(`/calc/${calculationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calculation:', error);
      throw error;
    }
  }
};

export default api;
