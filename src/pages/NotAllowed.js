// NotAllowed.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotAllowed = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Access Denied</h1>
            <p className="text-lg mb-6">You don't have permission to access this page.</p>
            <Link to="/" className="text-blue-600 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotAllowed;
