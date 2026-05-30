import axios from 'axios';

const api = axios.create({
  // Uses proxy in development (package.json "proxy" field → http://localhost:8080)
  // Uses REACT_APP_API_URL in production (set in .env.production)
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login if 401 received
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
