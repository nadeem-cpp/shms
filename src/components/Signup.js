import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';  // Import the custom axios instance
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');  // Default role is 'patient'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Call the signup API
            const response = await axiosInstance.post('/user/signup', { email, password, role });
            const uid = response.data.id;
            localStorage.setItem('uid', uid)
            localStorage.setItem('role', role)
    
            // Navigate to the profile page with the role passed as a prop
            navigate(`/profile`, { state: { role, uid } });
        } catch (error) {
            // Handle error (e.g., show error message)
            setError(error.response.data.error);
        }
    };
    

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Smart Healthcare Management</h2>
                <form onSubmit={handleSignup}>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Role
                        </label>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="patient"
                                    checked={role === 'patient'}
                                    onChange={() => setRole('patient')}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-2">Patient</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="doctor"
                                    checked={role === 'doctor'}
                                    onChange={() => setRole('doctor')}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-2">Doctor</span>
                            </label>

                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
                            Sign Up
                        </button>
                    </div>

                    {/* Login Link for existing users */}
                    <p className="mt-4 text-center text-gray-600">
                        Already a user? <Link to="/" className="text-blue-600 hover:underline">Login here</Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Signup;
