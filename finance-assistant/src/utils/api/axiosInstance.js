import axios from 'axios';
import { HEADERS, CONTENT_TYPES, TIMEOUTS } from './constants';
import { handleApiError } from './errorHandler';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
    [HEADERS.ACCEPT]: CONTENT_TYPES.JSON
  },
  withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;

      // Removed setting cookie to avoid SameSite issues in cross-origin requests
      // document.cookie = `accessToken=${token}; path=/; SameSite=Strict`;
    }
    
    // Log request (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
        headers: config.headers,
      });
    }
    
    return config;
  },
  (error) => {
    // Log request error
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;
      
      // Handle specific error status codes
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error(`Error: ${status}`, error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    // Format the error message
    error.message = handleApiError(error);
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 