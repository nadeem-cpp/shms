import axios from 'axios';

// Create an Axios instance with a base URL and default settings
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',  // API base URL
  headers: {
    'Content-Type': 'application/json',  // default headers
  },
});

export default axiosInstance;
