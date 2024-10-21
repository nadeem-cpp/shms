import axios from 'axios';

// Create an Axios instance with a base URL and default settings
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',  // API base URL
  headers: {
    'Content-Type': 'application/json',  // default headers
    'Authorization': `Bearer ${localStorage.getItem('token')}`
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5000'
  },
  // withCredentials:true
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
