import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically set Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set Authorization header dynamically
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to check for token expiration
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid, clear auth data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      localStorage.removeItem('role');

      alert('Your session has expired! Please log in again.');

      // Redirect user to login page
      window.location.href = '/';
    }
    // Check for 422 Unauthorized access (forbidden actions)
    if (error.response.status === 403) {
      alert('You are not authorized to access this resource.');
      window.location.href = '/not-allowed'; // Redirect to "Not Allowed" page
    }



    return Promise.reject(error);
  }
);

export default axiosInstance;
