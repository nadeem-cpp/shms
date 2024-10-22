import React from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const clearCookies = () => {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';  // Expires all cookies
        });
      };

    // Logout function to clear cookies, localStorage, and revoke JWT
    const handleLogout = async () => {
        try {
            // Revoke JWT token by calling the backend API (adjust the endpoint as necessary)
            // await axiosInstance.post('/user/logout');

            clearCookies()
            
            // Clear local storage
            localStorage.clear();

            // Redirect to login page
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="w-full bg-blue-900 p-4 flex justify-between items-center">
                {/* SHMS Logo on the left corner */}
                <div className="flex items-center">
                    <span className="text-white text-xl">Smart Hospital Management System</span>
                </div>
                
                {/* Logout button on the right corner */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            <main className="flex-grow">
                {/* Child components for specific dashboard content */}
                {children}
            </main>

            <footer className="w-full bg-gray-800 text-white p-4 text-center">
                © {new Date().getFullYear()} Smart Healthcare Management System. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;
