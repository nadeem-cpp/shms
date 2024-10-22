import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';  // Your Axios instance

const Logout = () => {
  const navigate = useNavigate();

  // Function to clear cookies
  const clearCookies = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';  // Expires all cookies
    });
  };

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call API to revoke the JWT token
        await axiosInstance.post('/user/logout'); // Replace this with your actual logout API endpoint

        // Clear localStorage
        localStorage.clear();

        // Clear cookies
        clearCookies();

        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Error logging out', error);
      }
    };

    handleLogout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;