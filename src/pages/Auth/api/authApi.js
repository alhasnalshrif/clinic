import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authApi = {
  login: (credentials) => {
    return api.post('/api-token-auth/', credentials);
  },

  logout: () => {
    return api.post('/auth/logout/');
  },

  getCurrentUser: () => {
    return api.get('/api/auth/user/');
  },

  register: (userData) => {
    return api.post('/register/', userData);
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (token, password) => {
    return api.post('/auth/reset-password', { token, password });
  },

  changePassword: (passwords) => {
    return api.post('/auth/change-password', passwords);
  },

  refreshToken: () => {
    return api.post('/auth/refresh-token');
  }
};

export default authApi;
