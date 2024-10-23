import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null); // State for storing selected user details
    const [roleFilter, setRoleFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    
    useEffect(() => {
        axiosInstance.get('/user/get', {
            // headers: {
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
        })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching users!", error);
            });
    }, []);

    const deleteUser = (userId) => {
        let resp = window.confirm("This action will delete all data related to user, including appointments, and all record")
        if (resp) {
            axiosInstance.delete(`/user/delete?id=${userId}`)
                .then(() => {
                    setUsers(users.filter(user => user.id !== userId));
                })
                .catch(error => {
                    console.error("There was an error deleting the user!", error);
                });
        }
    };

    // Fetch user details when a row is clicked
    const fetchUserDetails = (userId, role) => {
        axiosInstance.get(`/${role}/details?id=${userId}`)
            .then(response => {
                setSelectedUserDetails(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching user details!", error);
            });
    };

    // Filter users based on role and email
    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter === '' || user.role.toLowerCase().includes(roleFilter.toLowerCase());
        const matchesEmail = emailFilter === '' || user.email.toLowerCase().includes(emailFilter.toLowerCase());
        return matchesRole && matchesEmail;
    });

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>

            {/* Filter Section */}
            <div className="mb-4 flex space-x-4">
                <input
                    type="text"
                    placeholder="Filter by role"
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="border px-4 py-2 rounded w-1/3"
                />
                <input
                    type="text"
                    placeholder="Filter by email"
                    value={emailFilter}
                    onChange={e => setEmailFilter(e.target.value)}
                    className="border px-4 py-2 rounded w-1/3"
                />
            </div>

            {/* User Table */}
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="text-left">
                        <th className="py-2 px-4">Sr.</th>
                        <th className="py-2 px-4">PID</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Role</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <tr
                                key={user.id}
                                className="border-b cursor-pointer"
                                onClick={() => fetchUserDetails(user.id, user.role)} // Fetch details when row is clicked
                            >
                                <td className="py-2 px-4">{index + 1}</td>
                                <td className="py-2 px-4">{user.id}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.role}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click
                                            deleteUser(user.id);
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Selected User Details */}
            {selectedUserDetails && (
                <div className="mt-8 p-4 border rounded bg-gray-50">
                    <h3 className="text-xl font-bold mb-4">User Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>Name:</strong> {selectedUserDetails.name}</p>
                            <p><strong>Date Of Birth:</strong> {new Date(selectedUserDetails.dob).toDateString()}</p>
                            <p><strong>Gender:</strong> {selectedUserDetails.gender}</p>
                        </div>
                        <div>
                            {selectedUserDetails.role === "doctor" && (
                                <p><strong>Speciality:</strong> {selectedUserDetails.speciality}</p>
                            )}
                            <p><strong>Contact No:</strong> {selectedUserDetails.contact}</p>
                            <p><strong>Address:</strong> {selectedUserDetails.address}</p>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
