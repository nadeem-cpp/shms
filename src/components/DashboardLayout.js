import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const {logout} = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            logout()
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="w-full bg-blue-900 p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-white text-lg md:text-xl">Smart Hospital Management System</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm md:text-base"
                >
                    Logout
                </button>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            {/* <footer className="w-full bg-gray-800 text-white p-4 text-center text-sm md:text-base">
                © {new Date().getFullYear()} Smart Healthcare Management System. All rights reserved.
            </footer> */}
        </div>
    );
};

export default DashboardLayout;
