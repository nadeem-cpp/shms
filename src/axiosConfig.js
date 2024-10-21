import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

// Response interceptor to check for token expiration
axiosInstance.interceptors.response.use(
  response => response, // If the response is successful, return it
  error => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      localStorage.removeItem('role');

      // Use window.location or navigate to force user back to login
      window.location.href = '/'; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
