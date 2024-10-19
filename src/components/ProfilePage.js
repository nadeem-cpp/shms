import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Profile = () => {
    const location = useLocation();
    const { role, uid } = location.state;  // Get role and uid from state
    const [profileData, setProfileData] = useState({
        name: '',
        dob: '',
        contact_no: '',
        gender: '',
        address: '',
        ...(role === 'doctor' ? { speciality: '' } : { heart_rate: '', blood_pressure: '' })  // Dynamic fields
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any previous errors

        const age = calculateAge(profileData.dob);

        // Age validation based on role
        if (role === 'doctor' && age < 18) {
            setError('Doctor must be at least 18 years old.');
            return;
        } else if (role === 'patient' && age < 2) {
            setError('Patient must be at least 2 years old.');
            return;
        }

        try {
            const url = `/${role}/profile`;  // Set the appropriate API endpoint based on role
            await axiosInstance.post(url, { user_id: uid, ...profileData });
            // Redirect to the respective dashboard after profile creation
            navigate(`/${role}-dashboard`);
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    {role === 'doctor' ? 'Doctor' : 'Patient'} Profile
                </h2>
                {error && (
                    <div className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Common Fields */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={profileData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">Date of Birth</label>
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={profileData.dob}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_no">Contact Number</label>
                        <input
                            id="contact_no"
                            name="contact_no"
                            type="text"
                            value={profileData.contact_no}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={profileData.gender}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Address</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={profileData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Doctor-specific fields */}
                    {role === 'doctor' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="speciality">Speciality</label>
                            <input
                                id="speciality"
                                name="speciality"
                                type="text"
                                value={profileData.speciality}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Submit Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
