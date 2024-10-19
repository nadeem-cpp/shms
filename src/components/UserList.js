import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const UserList = () => {
    const [users, setUsers] = useState([]);

    // Fetch users from the API
    useEffect(() => {
        axiosInstance.get('/user')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching users!", error);
            });
    }, []);

    // Delete a user
    const deleteUser = (userId) => {
        axiosInstance.delete(`/user/delete?id=${userId}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== userId));
            })
            .catch(error => {
                console.error("There was an error deleting the user!", error);
            });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">ID</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b">
                            <td className="py-2 px-4">{user.id}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">{user.role}</td>
                            <td className="py-2 px-4">
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
