import React, { useContext, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {login} = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      const data = response.data;
      // localStorage.setItem('uid', data.id);
      // localStorage.setItem('token', data.token);

      login(data.token, data.role, data.id)

      // Set the Authorization header for future requests
      // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const role = response.data.role;
      // localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (role === 'patient' ) {
        navigate('/patient-dashboard', {token:data.token});
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Smart Healthcare Management</h2>
        <form onSubmit={handleLogin}>
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
              Login
            </button>
          </div>
        </form>

        {/* Signup Link for new users */}
        <p className="mt-4 text-center text-gray-600">
          New user? <Link to="/signup" className="text-blue-600 hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
