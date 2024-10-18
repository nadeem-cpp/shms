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

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `/${role}/profile`;  // Set the appropriate API endpoint based on role
            await axiosInstance.post(url, { user_id: uid, ...profileData });
            // Redirect to the respective dashboard after profile creation
            navigate(`/${role}-dashboard`);
        } catch (error) {
            console.log(error.response.data.error);
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    {role === 'doctor' ? 'Doctor' : 'Patient'} Profile
                </h2>
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

                    {/* Patient-specific fields */}
                    {/* {role === 'patient' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="heart_rate">Heart Rate</label>
                                <input
                                    id="heart_rate"
                                    name="heart_rate"
                                    type="number"
                                    value={profileData.heart_rate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blood_pressure">Blood Pressure</label>
                                <input
                                    id="blood_pressure"
                                    name="blood_pressure"
                                    type="text"
                                    value={profileData.blood_pressure}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                        </>
                    )} */}

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
